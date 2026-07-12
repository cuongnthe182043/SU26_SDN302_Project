import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LeafletMap from '../components/LeafletMap';

const features = [
  {
    title: 'Smart Contact Book',
    description: 'Create, edit, favorite, and organize every contact with a fast, searchable table.',
  },
  {
    title: 'Google Contacts Sync',
    description: 'Connect your Google account and import your People contacts in one click.',
  },
  {
    title: 'Nearby Search',
    description: 'Find contacts around any location using geospatial queries and live map pins.',
  },
  {
    title: 'OpenStreetMap Powered',
    description: 'Every location renders on free OpenStreetMap tiles via Leaflet — no API key needed.',
  },
  {
    title: 'Secure JWT Auth',
    description: 'Your data is protected behind token-based authentication on every request.',
  },
  {
    title: 'Insight Dashboard',
    description: 'Track totals, favorites, and sync sources at a glance with live stats and charts.',
  },
];

export default function LandingPage() {
  const { token, loading } = useAuth();

  if (!loading && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-grid-fade">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <span className="text-lg font-semibold text-white">Personal Address Book</span>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Now powered by OpenStreetMap + Leaflet
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              All your contacts, <span className="text-emerald-300">mapped</span> and in one place.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Manage contacts, sync with Google, and find people nearby on a free, open map —
              no billing account, no API key, ever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-emerald-300"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-glow">
            <LeafletMap
              center={[16.0544, 108.2022]}
              zoom={12}
              className="h-80 w-full sm:h-96"
              markers={[{ position: [16.0544, 108.2022], label: 'A contact near Da Nang, Vietnam' }]}
            />
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
            Everything you need to stay connected
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-400">
            One dashboard for every contact, every source, and every place they call home.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:bg-slate-800"
              >
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6">
        <p className="text-center text-sm text-slate-500">
          Personal Address Book &middot; Built with React, Express, MongoDB &amp; Leaflet
        </p>
      </footer>
    </div>
  );
}
