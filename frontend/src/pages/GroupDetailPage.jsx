import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { groupsApi } from '../api/groups';
import { contactsApi } from '../api/contacts';
import ContactTable from '../components/ContactTable';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerResults, setPickerResults] = useState([]);
  const [pickerSearched, setPickerSearched] = useState(false);

  const load = async () => {
    const { data } = await groupsApi.get(id);
    setGroup(data.group);
    setContacts(data.contacts);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!group) return <div className="text-slate-300">Loading...</div>;

  const memberIds = new Set(contacts.map((contact) => contact._id));

  const searchContacts = async () => {
    const { data } = await contactsApi.list({
      search: pickerQuery,
      limit: 20,
      sortBy: 'fullName',
      sortOrder: 'asc',
    });
    setPickerResults(data.contacts.filter((contact) => !memberIds.has(contact._id)));
    setPickerSearched(true);
  };

  const addContact = async (contactId) => {
    const { data } = await groupsApi.addContacts(group._id, [contactId]);
    setContacts(data.contacts);
    setPickerResults((prev) => prev.filter((contact) => contact._id !== contactId));
  };

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

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Add Contacts</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-64 flex-1">
            <SearchBar value={pickerQuery} onChange={setPickerQuery} placeholder="Search contacts to add" />
          </div>
          <Button onClick={searchContacts}>Search</Button>
        </div>
        {pickerSearched ? (
          pickerResults.length === 0 ? (
            <p className="text-sm text-slate-400">No matching contacts to add.</p>
          ) : (
            <div className="grid gap-2">
              {pickerResults.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2"
                >
                  <div>
                    <p className="text-sm text-white">{contact.fullName}</p>
                    <p className="text-xs text-slate-400">{contact.email || contact.phone || '-'}</p>
                  </div>
                  <Button variant="secondary" onClick={() => addContact(contact._id)}>
                    <UserPlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )
        ) : null}
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
        onRemoveFromGroup={async (contactId) => {
          await groupsApi.removeContact(group._id, contactId);
          load();
        }}
      />
    </div>
  );
}
