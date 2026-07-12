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
            <span className="hidden text-sm text-slate-400 sm:block">{user?.name}</span>
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
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <nav className="grid gap-2">
            {[
              ['/dashboard', 'Dashboard'],
              ['/contacts', 'Contacts'],
              ['/contacts/new', 'Create Contact'],
              ['/nearby', 'Nearby'],
              ['/recent', 'Recently'],
              ['/groups', 'Groups'],
              ['/blacklist', 'Blacklist'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-white/5'}`
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
