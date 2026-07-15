import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon as StarSolid, NoSymbolIcon as NoSymbolSolid } from '@heroicons/react/24/solid';
import { EyeIcon, MapPinIcon, NoSymbolIcon, StarIcon, TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';

export default function ContactTable({
  contacts,
  onDelete,
  onToggleFavorite,
  onToggleBlacklist,
  onRemoveFromGroup,
  showActions = true,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(pendingDelete._id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete contact. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900 p-10 text-center text-sm text-slate-400">
        No contacts to show.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-slate-950 text-slate-400">
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
            <tr key={contact._id} className="transition hover:bg-slate-800">
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
                        className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
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
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {contact.source}
                </span>
              </td>
              {showActions ? (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
                      to={`/contacts/${contact._id}`}
                    >
                      <EyeIcon className="h-4 w-4" /> View
                    </Link>
                    <button
                      type="button"
                      aria-pressed={contact.favorite}
                      title={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      onClick={() => onToggleFavorite(contact._id)}
                      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 transition ${
                        contact.favorite
                          ? 'bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-300/40 hover:bg-amber-400/25'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                      }`}
                    >
                      {contact.favorite ? <StarSolid className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
                    </button>
                    {onToggleBlacklist ? (
                      <button
                        type="button"
                        aria-pressed={contact.isBlacklisted}
                        title={contact.isBlacklisted ? 'Remove from blacklist' : 'Add to blacklist'}
                        onClick={() => onToggleBlacklist(contact._id)}
                        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 transition ${
                          contact.isBlacklisted
                            ? 'bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/40 hover:bg-rose-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                        }`}
                      >
                        {contact.isBlacklisted ? <NoSymbolSolid className="h-4 w-4" /> : <NoSymbolIcon className="h-4 w-4" />}
                      </button>
                    ) : null}
                    {onRemoveFromGroup ? (
                      <Button variant="secondary" onClick={() => onRemoveFromGroup(contact._id)} title="Remove from group">
                        <UserMinusIcon className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button variant="secondary" onClick={() => setPendingDelete(contact)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete contact"
        message={pendingDelete ? `Are you sure you want to delete "${pendingDelete.fullName}"? This cannot be undone.` : ''}
        loading={deleting}
        error={deleteError}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError('');
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
