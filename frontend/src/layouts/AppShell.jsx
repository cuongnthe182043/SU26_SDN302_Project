import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

export default function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-grid-fade">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="text-lg font-semibold text-white">
            Personal Address Book
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-400 sm:block">{user?.name}</span>
              <span className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-slate-800">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </span>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-slate-900 p-4">
          <nav className="grid gap-2">
            {[
              ['/dashboard', 'Dashboard'],
              ['/nearby', 'Nearby'],
              ['/recent', 'Recently'],
              ['/groups', 'Groups'],
              ['/blacklist', 'Blacklist'],
              ['/profile', 'Profile'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
