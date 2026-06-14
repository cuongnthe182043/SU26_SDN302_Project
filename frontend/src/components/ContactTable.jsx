import { Link } from 'react-router-dom';
import Button from './Button';

export default function ContactTable({
  contacts,
  onDelete,
  onToggleFavorite,
  showActions = true,
}) {
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
            <tr key={contact._id}>
              <td className="px-4 py-3 text-white">
                {contact.fullName}{' '}
                {contact.favorite ? <span className="ml-2 text-amber-300">★</span> : null}
              </td>
              <td className="px-4 py-3 text-slate-300">{contact.email || '-'}</td>
              <td className="px-4 py-3 text-slate-300">{contact.phone || '-'}</td>
              <td className="px-4 py-3 text-slate-300">{contact.source}</td>
              {showActions ? (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link className="rounded-xl bg-white/5 px-3 py-2 text-slate-100" to={`/contacts/${contact._id}`}>
                      View
                    </Link>
                    <Button variant="secondary" onClick={() => onToggleFavorite(contact._id)}>
                      Favorite
                    </Button>
                    <Button variant="secondary" onClick={() => onDelete(contact._id)}>
                      Delete
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
