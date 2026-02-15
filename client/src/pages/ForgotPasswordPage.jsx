import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

      {sent ? (
        <div className="auth-success">
          If an account exists with that email, a reset link has been sent. Check your console log for the link (MVP mode).
        </div>
      ) : (
        <>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" loading={loading}>Send Reset Link</Button>
          </form>
        </>
      )}

      <div className="auth-footer">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthLayout>
  );
}
