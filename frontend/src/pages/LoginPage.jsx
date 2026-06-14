import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glow"
        onSubmit={async (e) => {
          e.preventDefault();
          await login(form);
          navigate('/dashboard');
        }}
      >
        <h1 className="mb-6 text-2xl font-semibold text-white">Login</h1>
        <div className="grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit">Login</Button>
          <Link className="text-sm text-emerald-300" to="/register">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
