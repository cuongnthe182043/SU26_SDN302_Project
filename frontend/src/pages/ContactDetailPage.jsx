import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { contactsApi } from '../api/contacts';
import Button from '../components/Button';
import MapEmbed from '../components/MapEmbed';
import { formatDate } from '../utils/formatDate';

export default function ContactDetailPage() {
  const { id } = useParams();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    contactsApi.get(id).then(({ data }) => setContact(data.contact));
  }, [id]);

  if (!contact) return <div className="text-slate-300">Loading...</div>;

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold text-white">{contact.fullName}</h1>
        <p className="mt-2 text-slate-300">{contact.email || contact.phone || 'No contact details'}</p>
        <div className="mt-4 flex gap-3">
          <Link to={`/contacts/${contact._id}/edit`} className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950">
            Edit
          </Link>
          <Button variant="secondary" onClick={async () => { await contactsApi.toggleFavorite(contact._id); const { data } = await contactsApi.get(contact._id); setContact(data.contact); }}>
            Toggle Favorite
          </Button>
        </div>
      </div>
      <MapEmbed contact={contact} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
        <div>Phone: {contact.phone || '-'}</div>
        <div>Birthday: {formatDate(contact.birthday)}</div>
        <div>Address: {contact.address || '-'}</div>
        <div>Notes: {contact.note || '-'}</div>
      </div>
    </div>
  );
}
