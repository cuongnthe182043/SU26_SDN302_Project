import { useEffect, useState } from 'react';
import { contactsApi } from '../api/contacts';
import ContactTable from '../components/ContactTable';
import Button from '../components/Button';

const TABS = [
  { key: 'viewed', label: 'Recently Viewed' },
  { key: 'added', label: 'Recently Added' },
];

export default function RecentPage() {
  const [type, setType] = useState('viewed');
  const [contacts, setContacts] = useState([]);

  const load = async () => {
    const { data } = await contactsApi.recent({ type, limit: 20 });
    setContacts(data.contacts);
  };

  useEffect(() => {
    load();
  }, [type]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Recently</h1>
        <p className="text-sm text-slate-400">Contacts you viewed or added recently.</p>
      </div>
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={type === tab.key ? 'primary' : 'secondary'}
            onClick={() => setType(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <ContactTable
        contacts={contacts}
        onDelete={async (id) => {
          await contactsApi.remove(id);
          load();
        }}
        onToggleFavorite={async (id) => {
          await contactsApi.toggleFavorite(id);
          load();
        }}
        onToggleBlacklist={async (id) => {
          await contactsApi.toggleBlacklist(id);
          load();
        }}
      />
    </div>
  );
}
