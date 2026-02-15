import './AuthLayout.css';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">T</div>
          <span>TaskFlow AI</span>
        </div>
        {children}
      </div>
    </div>
  );
}
