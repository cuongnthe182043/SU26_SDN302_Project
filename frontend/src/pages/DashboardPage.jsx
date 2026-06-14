import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ChartPanel from '../components/ChartPanel';
import Button from '../components/Button';
import { dashboardApi } from '../api/dashboard';
import { googleApi } from '../api/google';

export default function DashboardPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    dashboardApi.stats().then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Contacts" value={stats.totalContacts || 0} />
        <StatCard label="Favorites" value={stats.favoriteContacts || 0} />
        <StatCard label="Google Contacts" value={stats.googleContacts || 0} />
        <StatCard label="Local Contacts" value={stats.localContacts || 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 text-lg font-semibold text-white">Google Sync</div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={async () => {
                const { data } = await googleApi.connect();
                window.location.href = data.url;
              }}
            >
              Connect Google
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                await googleApi.sync();
                const { data } = await dashboardApi.stats();
                setStats(data);
              }}
            >
              Sync Contacts
            </Button>
          </div>
        </div>
        <ChartPanel stats={stats} />
      </div>
    </div>
  );
}
