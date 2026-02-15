const { getDb } = require('../database/connection');

function getStats(userId) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
      SUM(CASE WHEN status != 'completed' AND due_date IS NOT NULL AND due_date < ? THEN 1 ELSE 0 END) as overdue_tasks,
      SUM(CASE WHEN due_date = ? THEN 1 ELSE 0 END) as due_today,
      SUM(CASE WHEN due_date BETWEEN ? AND ? THEN 1 ELSE 0 END) as due_this_week
    FROM tasks WHERE user_id = ?
  `).get(today, today, today, weekFromNow, userId);

  stats.completion_rate = stats.total_tasks > 0
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 1000) / 10
    : 0;

  return stats;
}

function getProductivity(userId, days = 30) {
  const db = getDb();
  const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

  const dailyCompleted = db.prepare(`
    SELECT DATE(completed_at) as date, COUNT(*) as completed
    FROM tasks
    WHERE user_id = ? AND status = 'completed' AND completed_at >= ?
    GROUP BY DATE(completed_at)
    ORDER BY date ASC
  `).all(userId, startDate);

  const dailyCreated = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as created
    FROM tasks
    WHERE user_id = ? AND created_at >= ?
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all(userId, startDate);

  // Merge into single timeline
  const dateMap = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0];
    dateMap[d] = { date: d, completed: 0, created: 0 };
  }
  dailyCompleted.forEach(row => {
    if (dateMap[row.date]) dateMap[row.date].completed = row.completed;
  });
  dailyCreated.forEach(row => {
    if (dateMap[row.date]) dateMap[row.date].created = row.created;
  });

  const categoryBreakdown = db.prepare(`
    SELECT c.id as category_id, c.name, c.color, COUNT(tc.task_id) as count
    FROM categories c
    LEFT JOIN task_categories tc ON c.id = tc.category_id
    LEFT JOIN tasks t ON tc.task_id = t.id AND t.user_id = ?
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY count DESC
  `).all(userId, userId);

  const priorityRows = db.prepare(`
    SELECT priority, COUNT(*) as count
    FROM tasks WHERE user_id = ?
    GROUP BY priority
  `).all(userId);

  const priorityBreakdown = { low: 0, medium: 0, high: 0, urgent: 0 };
  priorityRows.forEach(row => {
    priorityBreakdown[row.priority] = row.count;
  });

  return {
    daily_completions: Object.values(dateMap),
    category_breakdown: categoryBreakdown,
    priority_breakdown: priorityBreakdown,
  };
}

module.exports = { getStats, getProductivity };
