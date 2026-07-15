import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import getErrorMessage from '../utils/getErrorMessage';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Reset link is invalid or has expired'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form className="w-full rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-glow" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-2xl font-semibold text-white">Reset password</h1>
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
          </Button>
          <Link className="text-sm text-emerald-300" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
