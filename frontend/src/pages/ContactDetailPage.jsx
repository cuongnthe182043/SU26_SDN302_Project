import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { CakeIcon, MapPinIcon, NoSymbolIcon, PencilSquareIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/outline';
import { contactsApi } from '../api/contacts';
import Button from '../components/Button';
import MapEmbed from '../components/MapEmbed';
import NotesPanel from '../components/NotesPanel';
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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">{contact.fullName}</h1>
          {contact.favorite ? <StarSolid className="h-6 w-6 text-amber-300" /> : null}
          {contact.isBlacklisted ? <NoSymbolIcon className="h-6 w-6 text-rose-400" title="Blacklisted" /> : null}
        </div>
        <p className="mt-2 text-slate-300">{contact.email || contact.phone || 'No contact details'}</p>
        {contact.groups?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {contact.groups.map((group) => (
              <span key={group._id} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                {group.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex gap-3">
          <Link
            to={`/contacts/${contact._id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950"
          >
            <PencilSquareIcon className="h-4 w-4" /> Edit
          </Link>
          <Button
            variant="secondary"
            onClick={async () => {
              await contactsApi.toggleFavorite(contact._id);
              const { data } = await contactsApi.get(contact._id);
              setContact(data.contact);
            }}
          >
            <StarIcon className="mr-2 h-4 w-4" /> Toggle Favorite
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              await contactsApi.toggleBlacklist(contact._id);
              const { data } = await contactsApi.get(contact._id);
              setContact(data.contact);
            }}
          >
            <NoSymbolIcon className="mr-2 h-4 w-4" /> Toggle Blacklist
          </Button>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <MapPinIcon className="h-5 w-5 text-emerald-300" /> Location
        </h2>
        <MapEmbed contact={contact} />
      </div>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-slate-500" /> {contact.phone || '-'}
        </div>
        <div className="flex items-center gap-2">
          <CakeIcon className="h-4 w-4 text-slate-500" /> {formatDate(contact.birthday)}
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPinIcon className="h-4 w-4 text-slate-500" /> {contact.address || '-'}
        </div>
        <div className="sm:col-span-2">
          <span className="text-slate-500">Notes:</span> {contact.note || '-'}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Notes</h2>
        <NotesPanel contactId={contact._id} />
      </div>
    </div>
  );
}
