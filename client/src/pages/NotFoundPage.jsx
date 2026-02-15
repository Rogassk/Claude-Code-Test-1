import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <AuthLayout>
      <h1 className="auth-title">404</h1>
      <p className="auth-subtitle">Page not found</p>
      <div style={{ textAlign: 'center' }}>
        <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
      </div>
    </AuthLayout>
  );
}
