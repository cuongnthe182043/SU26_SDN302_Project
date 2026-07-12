import { useEffect, useState } from 'react';
import Input from './Input';
import Button from './Button';
import AddressAutocomplete from './AddressAutocomplete';
import { uploadApi } from '../api/upload';
import { groupsApi } from '../api/groups';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()0-9.\-\s]{6,20}$/;

export default function ContactForm({ initialValues, onSubmit, submitLabel, bare = false }) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    groupsApi.list().then(({ data }) => setGroups(data.groups));
  }, []);

  const toggleGroup = (groupId) =>
    setForm((prev) => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter((id) => id !== groupId)
        : [...prev.groups, groupId],
    }));

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (form.email && !emailPattern.test(form.email)) return 'Email format is invalid';
    if (form.phone && !phonePattern.test(form.phone)) return 'Phone format is invalid';
    return '';
  };

  return (
    <form
      className={bare ? 'grid gap-4' : 'grid gap-4 rounded-2xl border border-white/10 bg-slate-900 p-6'}
      onSubmit={async (e) => {
        e.preventDefault();
        const message = validate();
        if (message) {
          setError(message);
          return;
        }
        setError('');
        setSubmitting(true);
        try {
          await onSubmit(form);
        } catch (submitError) {
          setError(submitError.response?.data?.message || 'Failed to save contact. Please try again.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
      <Input label="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
      <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
      <Input label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
      <AddressAutocomplete label="Address" value={form.address} onChange={(value) => update('address', value)} />
      <Input label="Birthday" type="date" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} />
      <label className="block space-y-2 text-sm text-slate-300">
        <span>Avatar Upload</span>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError('');
            try {
              const { data } = await uploadApi.avatar(file);
              update('avatarUrl', data.url);
            } catch (uploadError) {
              setError(uploadError.response?.data?.message || 'Avatar upload failed');
            } finally {
              setUploading(false);
            }
          }}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-300"
        />
      </label>
      <label className="block space-y-2 text-sm text-slate-300">
        <span>Note</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          value={form.note}
          onChange={(e) => update('note', e.target.value)}
        />
      </label>
      <Input label="Avatar URL" value={form.avatarUrl} onChange={(e) => update('avatarUrl', e.target.value)} />
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input type="checkbox" checked={form.favorite} onChange={(e) => update('favorite', e.target.checked)} />
        Favorite
      </label>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.isBlacklisted}
          onChange={(e) => update('isBlacklisted', e.target.checked)}
        />
        Blacklisted
      </label>
      {groups.length > 0 ? (
        <div className="space-y-2 text-sm text-slate-300">
          <span>Groups</span>
          <div className="flex flex-wrap gap-3">
            {groups.map((group) => (
              <label key={group._id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.groups.includes(group._id)}
                  onChange={() => toggleGroup(group._id)}
                />
                {group.name}
              </label>
            ))}
          </div>
        </div>
      ) : null}
      <Button type="submit" disabled={uploading || submitting}>
        {uploading ? 'Uploading...' : submitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
