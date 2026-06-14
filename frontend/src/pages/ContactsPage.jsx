import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi } from '../api/contacts';
import SearchBar from '../components/SearchBar';
import ContactTable from '../components/ContactTable';
import Pagination from '../components/Pagination';
import Button from '../components/Button';

export default function ContactsPage() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ contacts: [], pagination: { pages: 1 } });

  const load = async () => {
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
    load();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-64 flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search name, email, phone"
          />
        </div>
        <Button
          onClick={() => {
            setPage(1);
            setSearch(query);
          }}
        >
          Search
        </Button>
        <Link to="/contacts/new" className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950">
          New Contact
        </Link>
      </div>
      <ContactTable
        contacts={data.contacts}
        onDelete={async (id) => {
          await contactsApi.remove(id);
          load();
        }}
        onToggleFavorite={async (id) => {
          await contactsApi.toggleFavorite(id);
          load();
        }}
      />
      <Pagination page={page} pages={data.pagination.pages || 1} onPageChange={setPage} />
    </div>
  );
}
