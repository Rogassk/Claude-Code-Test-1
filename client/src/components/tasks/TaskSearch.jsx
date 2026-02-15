import { Search } from 'lucide-react';
import './TaskSearch.css';

export default function TaskSearch({ value, onChange }) {
  return (
    <div className="task-search">
      <Search size={18} className="task-search-icon" />
      <input
        type="text"
        className="task-search-input"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
