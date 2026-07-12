import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import ContactTable from '../components/ContactTable';
import Pagination from '../components/Pagination';
import ContactFormModal from '../components/ContactFormModal';
import { dashboardApi } from '../api/dashboard';
import { googleApi } from '../api/google';
import { contactsApi } from '../api/contacts';

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ contacts: [], pagination: { pages: 1 } });
  const [createOpen, setCreateOpen] = useState(false);

  const loadStats = async () => {
    const { data: response } = await dashboardApi.stats();
    setStats(response);
  };

  const loadContacts = async () => {
    const { data: response } = await contactsApi.list({
      search,
      page,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setData(response);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadContacts();
  }, [page, search]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Contacts" value={stats.totalContacts || 0} />
        <StatCard label="Favorites" value={stats.favoriteContacts || 0} />
        <StatCard label="Google Contacts" value={stats.googleContacts || 0} />
        <StatCard label="Local Contacts" value={stats.localContacts || 0} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 text-lg font-semibold text-white">Google Sync</div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={async () => {
              const { data: response } = await googleApi.connect();
              window.location.href = response.url;
            }}
          >
            Connect Google
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              await googleApi.sync();
              await Promise.all([loadStats(), loadContacts()]);
            }}
          >
            Sync Contacts
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-64 flex-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search name, email, phone" />
          </div>
          <Button
            onClick={() => {
              setPage(1);
              setSearch(query);
            }}
          >
            Search
          </Button>
          <Button onClick={() => setCreateOpen(true)}>New Contact</Button>
        </div>
        <ContactTable
          contacts={data.contacts}
          onDelete={async (id) => {
            await contactsApi.remove(id);
            await Promise.all([loadStats(), loadContacts()]);
          }}
          onToggleFavorite={async (id) => {
            await contactsApi.toggleFavorite(id);
            await Promise.all([loadStats(), loadContacts()]);
          }}
          onToggleBlacklist={async (id) => {
            await contactsApi.toggleBlacklist(id);
            loadContacts();
          }}
        />
        <Pagination page={page} pages={data.pagination.pages || 1} onPageChange={setPage} />
      </div>

      <ContactFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async (form) => {
          await contactsApi.create(form);
          await Promise.all([loadStats(), loadContacts()]);
        }}
      />
    </div>
  );
}
