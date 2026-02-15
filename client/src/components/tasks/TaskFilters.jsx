import { Select } from '../common/Input';
import './TaskFilters.css';

export default function TaskFilters({ filters, onChange, categories }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="task-filters">
      <Select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value || undefined)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </Select>

      <Select
        value={filters.priority || ''}
        onChange={(e) => handleChange('priority', e.target.value || undefined)}
      >
        <option value="">All Priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </Select>

      <Select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value || undefined)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>

      <Select
        value={filters.sort || 'created_at'}
        onChange={(e) => handleChange('sort', e.target.value)}
      >
        <option value="created_at">Newest First</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </Select>
    </div>
  );
}
