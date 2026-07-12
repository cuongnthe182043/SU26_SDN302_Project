import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupsApi } from '../api/groups';
import { contactsApi } from '../api/contacts';
import ContactTable from '../components/ContactTable';
import Button from '../components/Button';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [contacts, setContacts] = useState([]);

  const load = async () => {
    const { data } = await groupsApi.get(id);
    setGroup(data.group);
    setContacts(data.contacts);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!group) return <div className="text-slate-300">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: group.color }} />
          <h1 className="text-2xl font-semibold text-white">{group.name}</h1>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await groupsApi.remove(group._id);
            navigate('/groups');
          }}
        >
          Delete Group
        </Button>
      </div>
      <ContactTable
        contacts={contacts}
        onDelete={async (contactId) => {
          await contactsApi.remove(contactId);
          load();
        }}
        onToggleFavorite={async (contactId) => {
          await contactsApi.toggleFavorite(contactId);
          load();
        }}
        onToggleBlacklist={async (contactId) => {
          await contactsApi.toggleBlacklist(contactId);
          load();
        }}
      />
    </div>
  );
}
