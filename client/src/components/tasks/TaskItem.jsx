import { Check, Square, Edit2, Trash2, Clock } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import DueDateDisplay from './DueDateDisplay';
import './TaskItem.css';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';

  const handleToggle = () => {
    onToggleStatus(task.id, isCompleted ? 'pending' : 'completed');
  };

  return (
    <div className={`task-item ${isCompleted ? 'task-item-completed' : ''}`}>
      <button className="task-checkbox" onClick={handleToggle} title={isCompleted ? 'Mark incomplete' : 'Mark complete'}>
        {isCompleted ? <Check size={18} /> : <Square size={18} />}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <PriorityBadge priority={task.priority} />
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {task.due_date && (
            <span className="task-meta-item">
              <Clock size={14} />
              <DueDateDisplay dueDate={task.due_date} status={task.status} />
            </span>
          )}
          {task.categories && task.categories.length > 0 && (
            <div className="task-categories">
              {task.categories.map((cat) => (
                <span key={cat.id} className="task-category-tag" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="task-action-btn" onClick={() => onEdit(task)} title="Edit task">
          <Edit2 size={16} />
        </button>
        <button className="task-action-btn task-action-delete" onClick={() => onDelete(task)} title="Delete task">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
