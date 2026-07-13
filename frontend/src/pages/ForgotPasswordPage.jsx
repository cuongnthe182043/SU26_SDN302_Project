import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { sendPasswordResetEmail } from '../services/emailjs.service';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('loading');

    try {
      const { data } = await authApi.forgotPassword(email);

      if (data.resetUrl) {
        await sendPasswordResetEmail({ email: data.email, name: data.name, resetUrl: data.resetUrl });
      }

      setStatus('sent');
    } catch {
      setError('Could not send the reset email. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form className="w-full rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-glow" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-2xl font-semibold text-white">Forgot password</h1>
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {status === 'sent' ? (
          <div className="mb-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            If that email is registered, a reset link has been sent to it.
          </div>
        ) : null}
        <div className="grid gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Send reset link'}
          </Button>
          <Link className="text-sm text-emerald-300" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
