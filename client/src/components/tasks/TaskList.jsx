import TaskItem from './TaskItem';
import EmptyState from '../common/EmptyState';
import { ClipboardList } from 'lucide-react';
import './TaskList.css';

export default function TaskList({ tasks, onToggleStatus, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No tasks found"
        description="Create a new task to get started, or adjust your filters."
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
