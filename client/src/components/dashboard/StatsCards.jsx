import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import './StatsCards.css';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Tasks', value: stats.total_tasks || 0, icon: ListTodo, color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Completed', value: stats.completed_tasks || 0, icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Overdue', value: stats.overdue_tasks || 0, icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Due Today', value: stats.due_today || 0, icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: card.bg }}>
            <card.icon size={22} style={{ color: card.color }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
