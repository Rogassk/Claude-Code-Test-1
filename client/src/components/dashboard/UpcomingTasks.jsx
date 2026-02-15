import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { tasksApi } from '../../api/tasks';
import PriorityBadge from '../tasks/PriorityBadge';
import DueDateDisplay from '../tasks/DueDateDisplay';
import EmptyState from '../common/EmptyState';
import './DashboardSection.css';

export default function UpcomingTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    tasksApi
      .list({ due_after: today, due_before: weekFromNow, status: 'pending', limit: 10, sort: 'due_date', order: 'asc' })
      .then((data) => setTasks(data.tasks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-section"><div className="section-loading" /></div>;

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Upcoming This Week</h3>
        <button className="section-link" onClick={() => navigate('/tasks')}>View All</button>
      </div>
      {tasks.length === 0 ? (
        <EmptyState icon={Calendar} title="No upcoming tasks" description="Your week looks clear" />
      ) : (
        <div className="section-list">
          {tasks.map((task) => (
            <div key={task.id} className="section-task">
              <span className="section-task-title">{task.title}</span>
              <DueDateDisplay dueDate={task.due_date} status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
