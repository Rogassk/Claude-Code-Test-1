import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-title">Set new password</h1>

      {done ? (
        <>
          <div className="auth-success">Password reset successfully!</div>
          <div className="auth-footer">
            <Link to="/login">Sign in with your new password</Link>
          </div>
        </>
      ) : (
        <>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            <Button type="submit" loading={loading}>Reset Password</Button>
          </form>
          <div className="auth-footer">
            <Link to="/login">Back to login</Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
