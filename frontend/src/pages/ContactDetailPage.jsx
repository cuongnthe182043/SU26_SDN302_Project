import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StarIcon as StarSolid, NoSymbolIcon as NoSymbolSolid } from '@heroicons/react/24/solid';
import { CakeIcon, MapPinIcon, NoSymbolIcon, PencilSquareIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/outline';
import { contactsApi } from '../api/contacts';
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
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">{contact.fullName}</h1>
          {contact.favorite ? <StarSolid className="h-6 w-6 text-amber-300" /> : null}
          {contact.isBlacklisted ? <NoSymbolIcon className="h-6 w-6 text-rose-400" title="Blacklisted" /> : null}
        </div>
        <p className="mt-2 text-slate-300">{contact.email || contact.phone || 'No contact details'}</p>
        {contact.groups?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {contact.groups.map((group) => (
              <span key={group._id} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
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
          <button
            type="button"
            aria-pressed={contact.favorite}
            onClick={async () => {
              await contactsApi.toggleFavorite(contact._id);
              const { data } = await contactsApi.get(contact._id);
              setContact(data.contact);
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              contact.favorite
                ? 'bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-300/40 hover:bg-amber-400/25'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            }`}
          >
            {contact.favorite ? <StarSolid className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
            {contact.favorite ? 'Favorited' : 'Add to Favorites'}
          </button>
          <button
            type="button"
            aria-pressed={contact.isBlacklisted}
            onClick={async () => {
              await contactsApi.toggleBlacklist(contact._id);
              const { data } = await contactsApi.get(contact._id);
              setContact(data.contact);
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              contact.isBlacklisted
                ? 'bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/40 hover:bg-rose-500/25'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            }`}
          >
            {contact.isBlacklisted ? <NoSymbolSolid className="h-4 w-4" /> : <NoSymbolIcon className="h-4 w-4" />}
            {contact.isBlacklisted ? 'Blacklisted' : 'Add to Blacklist'}
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <MapPinIcon className="h-5 w-5 text-emerald-300" /> Location
        </h2>
        <MapEmbed contact={contact} />
      </div>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-300 sm:grid-cols-2">
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
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Notes</h2>
        <NotesPanel contactId={contact._id} />
      </div>
    </div>
  );
}
