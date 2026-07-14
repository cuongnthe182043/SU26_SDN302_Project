import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { uploadApi } from '../api/upload';

const phonePattern = /^[+()0-9.\-\s]{6,20}$/;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', avatarUrl: user?.avatarUrl || '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (form.phone && !phonePattern.test(form.phone)) return 'Phone format is invalid';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your personal information.</p>
      </div>

      <form
        className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const message = validate();
          if (message) {
            setError(message);
            setSuccess('');
            return;
          }
          setError('');
          setSuccess('');
          setSaving(true);
          try {
            await updateProfile(form);
            setSuccess('Profile updated successfully');
          } catch (submitError) {
            setError(submitError.response?.data?.message || 'Failed to update profile. Please try again.');
          } finally {
            setSaving(false);
          }
        }}
      >
        {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
        {success ? <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{success}</div> : null}

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-800">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                {form.name ? form.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <label className="block flex-1 space-y-2 text-sm text-slate-300">
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
        </div>

        <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        <Input label="Email" value={user?.email || ''} disabled />
        <Input label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="e.g. +84 912 345 678" />

        <Button type="submit" disabled={uploading || saving} className="w-fit">
          {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
