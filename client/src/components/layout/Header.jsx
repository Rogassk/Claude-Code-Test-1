import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'TaskFlow';

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
    </header>
  );
}
