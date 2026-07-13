import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form
        className="w-full rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-glow"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          try {
            await login(form);
            navigate('/dashboard');
          } catch {
            setError('Invalid email or password');
          }
        }}
      >
        <h1 className="mb-6 text-2xl font-semibold text-white">Login</h1>
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit">Login</Button>
          <div className="flex items-center justify-between">
            <Link className="text-sm text-emerald-300" to="/register">
              Create account
            </Link>
            <Link className="text-sm text-emerald-300" to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          {googleClientId ? (
            <>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="h-px flex-1 bg-white/10" />
                <span>OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  theme="filled_black"
                  shape="pill"
                  onSuccess={async (credentialResponse) => {
                    setError('');
                    try {
                      await googleLogin(credentialResponse.credential);
                      navigate('/dashboard');
                    } catch {
                      setError('Google sign-in failed');
                    }
                  }}
                  onError={() => setError('Google sign-in failed')}
                />
              </div>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
}
