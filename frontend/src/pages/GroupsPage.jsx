import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { groupsApi } from '../api/groups';
import Input from '../components/Input';
import Button from '../components/Button';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10b981');
  const [error, setError] = useState('');

  const load = () => groupsApi.list().then(({ data }) => setGroups(data.groups));

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Groups</h1>
        <p className="text-sm text-slate-400">Organize your contacts into groups.</p>
      </div>
      <form
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          try {
            await groupsApi.create({ name, color });
            setName('');
            setColor('#10b981');
            load();
          } catch (createError) {
            setError(createError.response?.data?.message || 'Failed to create group');
          }
        }}
      >
        <div className="min-w-48 flex-1">
          <Input label="Group Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-16 rounded-xl border border-white/10 bg-slate-900/80"
          />
        </label>
        <Button type="submit">Create Group</Button>
      </form>
      {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <Link to={`/groups/${group._id}`} className="flex items-center gap-2 text-white hover:underline">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
                {group.name}
              </Link>
              <Button
                variant="secondary"
                onClick={async () => {
                  await groupsApi.remove(group._id);
                  load();
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-slate-400">{group.contactCount} contact(s)</p>
          </div>
        ))}
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400 sm:col-span-2 lg:col-span-3">
            No groups yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
