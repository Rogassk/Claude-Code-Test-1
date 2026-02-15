import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Square, Sun } from 'lucide-react';
import { tasksApi } from '../../api/tasks';
import PriorityBadge from '../tasks/PriorityBadge';
import EmptyState from '../common/EmptyState';
import './DashboardSection.css';

export default function TodayTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    tasksApi
      .list({ due_after: today, due_before: today, limit: 10, sort: 'priority' })
      .then((data) => setTasks(data.tasks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await tasksApi.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch {}
  };

  if (loading) return <div className="dashboard-section"><div className="section-loading" /></div>;

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Today's Tasks</h3>
        <button className="section-link" onClick={() => navigate('/tasks')}>View All</button>
      </div>
      {tasks.length === 0 ? (
        <EmptyState icon={Sun} title="No tasks due today" description="You're all caught up!" />
      ) : (
        <div className="section-list">
          {tasks.map((task) => (
            <div key={task.id} className={`section-task ${task.status === 'completed' ? 'section-task-done' : ''}`}>
              <button className="section-task-check" onClick={() => handleToggle(task.id, task.status)}>
                {task.status === 'completed' ? <Check size={16} /> : <Square size={16} />}
              </button>
              <span className="section-task-title">{task.title}</span>
              <PriorityBadge priority={task.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
