import { formatDate, isOverdue } from '../../utils/dateUtils';
import './DueDateDisplay.css';

export default function DueDateDisplay({ dueDate, status }) {
  if (!dueDate) return null;

  const overdue = isOverdue(dueDate, status);
  const label = formatDate(dueDate);

  return (
    <span className={`due-date ${overdue ? 'due-date-overdue' : ''}`}>
      {label}
    </span>
  );
}
