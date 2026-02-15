const { getDb } = require('../database/connection');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parseCategories(categoryData) {
  if (!categoryData) return [];
  return categoryData.split('|').map(item => {
    const [id, name, color] = item.split(':');
    return { id: parseInt(id), name, color };
  });
}

function create(userId, data) {
  const db = getDb();
  const { title, description, priority, due_date, category_ids } = data;

  const result = db.prepare(`
    INSERT INTO tasks (user_id, title, description, priority, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, title, description, priority, due_date);

  const taskId = result.lastInsertRowid;

  if (category_ids && category_ids.length > 0) {
    const insert = db.prepare('INSERT OR IGNORE INTO task_categories (task_id, category_id) VALUES (?, ?)');
    for (const catId of category_ids) {
      // Verify category belongs to user
      const cat = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(catId, userId);
      if (cat) {
        insert.run(taskId, catId);
      }
    }
  }

  return getById(userId, taskId);
}

function getById(userId, taskId) {
  const db = getDb();
  const task = db.prepare(`
    SELECT t.*,
      GROUP_CONCAT(c.id || ':' || c.name || ':' || c.color, '|') as category_data
    FROM tasks t
    LEFT JOIN task_categories tc ON t.id = tc.task_id
    LEFT JOIN categories c ON tc.category_id = c.id
    WHERE t.id = ? AND t.user_id = ?
    GROUP BY t.id
  `).get(taskId, userId);

  if (!task) {
    throw createError('Task not found', 404);
  }

  task.categories = parseCategories(task.category_data);
  delete task.category_data;
  return task;
}

function list(userId, filters = {}) {
  const db = getDb();
  const {
    status, priority, category, search,
    due_before, due_after,
    sort = 'created_at', order = 'desc',
    page = 1, limit = 20
  } = filters;

  let whereClauses = ['t.user_id = ?'];
  const params = [userId];

  if (status) {
    whereClauses.push('t.status = ?');
    params.push(status);
  }
  if (priority) {
    whereClauses.push('t.priority = ?');
    params.push(priority);
  }
  if (search) {
    whereClauses.push('(t.title LIKE ? OR t.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (due_before) {
    whereClauses.push('t.due_date <= ?');
    params.push(due_before);
  }
  if (due_after) {
    whereClauses.push('t.due_date >= ?');
    params.push(due_after);
  }
  if (category) {
    whereClauses.push('t.id IN (SELECT task_id FROM task_categories WHERE category_id = ?)');
    params.push(parseInt(category));
  }

  const whereStr = whereClauses.join(' AND ');

  // Count total matching tasks
  const countResult = db.prepare(`
    SELECT COUNT(DISTINCT t.id) as total
    FROM tasks t
    WHERE ${whereStr}
  `).get(...params);

  const total = countResult.total;
  const totalPages = Math.ceil(total / limit);

  // Sorting
  const validSorts = {
    due_date: 't.due_date',
    priority: "CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END",
    created_at: 't.created_at',
    title: 't.title',
    updated_at: 't.updated_at',
  };
  const sortCol = validSorts[sort] || validSorts.created_at;
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const offset = (page - 1) * limit;
  const queryParams = [...params];
  queryParams.push(limit, offset);

  const tasks = db.prepare(`
    SELECT t.*,
      GROUP_CONCAT(c.id || ':' || c.name || ':' || c.color, '|') as category_data
    FROM tasks t
    LEFT JOIN task_categories tc ON t.id = tc.task_id
    LEFT JOIN categories c ON tc.category_id = c.id
    WHERE ${whereStr}
    GROUP BY t.id
    ORDER BY ${sortCol} ${sortOrder}
    LIMIT ? OFFSET ?
  `).all(...queryParams);

  tasks.forEach(task => {
    task.categories = parseCategories(task.category_data);
    delete task.category_data;
  });

  return {
    tasks,
    pagination: { page, limit, total, totalPages },
  };
}

function update(userId, taskId, data) {
  const db = getDb();

  // Verify ownership
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId);
  if (!existing) {
    throw createError('Task not found', 404);
  }

  const fields = [];
  const values = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
  if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    values.push(taskId, userId);
    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  }

  // Update categories if provided
  if (data.category_ids !== undefined) {
    db.prepare('DELETE FROM task_categories WHERE task_id = ?').run(taskId);
    const insert = db.prepare('INSERT OR IGNORE INTO task_categories (task_id, category_id) VALUES (?, ?)');
    for (const catId of data.category_ids) {
      const cat = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(catId, userId);
      if (cat) {
        insert.run(taskId, catId);
      }
    }
  }

  return getById(userId, taskId);
}

function updateStatus(userId, taskId, status) {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId);
  if (!existing) {
    throw createError('Task not found', 404);
  }

  const completedAt = status === 'completed' ? new Date().toISOString() : null;

  db.prepare(`
    UPDATE tasks SET status = ?, completed_at = ?, updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(status, completedAt, taskId, userId);

  return getById(userId, taskId);
}

function remove(userId, taskId) {
  const db = getDb();
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(taskId, userId);
  if (result.changes === 0) {
    throw createError('Task not found', 404);
  }
}

module.exports = { create, getById, list, update, updateStatus, remove };
