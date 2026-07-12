import { Link } from 'react-router-dom';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { EyeIcon, MapPinIcon, NoSymbolIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export default function ContactTable({
  contacts,
  onDelete,
  onToggleFavorite,
  onToggleBlacklist,
  showActions = true,
}) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
        No contacts to show.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Source</th>
            {showActions ? <th className="px-4 py-3">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {contacts.map((contact) => (
            <tr key={contact._id} className="transition hover:bg-white/5">
              <td className="px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  {contact.favorite ? (
                    <StarSolid className="h-4 w-4 shrink-0 text-amber-300" />
                  ) : null}
                  {contact.isBlacklisted ? (
                    <NoSymbolIcon className="h-4 w-4 shrink-0 text-rose-400" title="Blacklisted" />
                  ) : null}
                  <span>{contact.fullName}</span>
                  {contact.location?.coordinates ? (
                    <MapPinIcon className="h-4 w-4 shrink-0 text-emerald-300" title="Location on map" />
                  ) : null}
                </div>
                {contact.groups?.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {contact.groups.map((group) => (
                      <span
                        key={group._id}
                        className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3 text-slate-300">{contact.email || '-'}</td>
              <td className="px-4 py-3 text-slate-300">{contact.phone || '-'}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {contact.source}
                </span>
              </td>
              {showActions ? (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3 py-2 text-slate-100 hover:bg-white/10"
                      to={`/contacts/${contact._id}`}
                    >
                      <EyeIcon className="h-4 w-4" /> View
                    </Link>
                    <Button variant="secondary" onClick={() => onToggleFavorite(contact._id)}>
                      <StarIcon className="h-4 w-4" />
                    </Button>
                    {onToggleBlacklist ? (
                      <Button variant="secondary" onClick={() => onToggleBlacklist(contact._id)}>
                        <NoSymbolIcon className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button variant="secondary" onClick={() => onDelete(contact._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
