import './Badge.css';

export default function Badge({ children, color, bg }) {
  return (
    <span className="badge" style={{ color, backgroundColor: bg }}>
      {children}
    </span>
  );
}
