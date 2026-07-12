import { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { notesApi } from '../api/notes';
import Button from './Button';

export default function NotesPanel({ contactId }) {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState('');

  const load = () => notesApi.list(contactId).then(({ data }) => setNotes(data.notes));

  useEffect(() => {
    load();
  }, [contactId]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-400">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              {editingId === note._id ? (
                <div className="grid gap-2">
                  <textarea
                    className="min-h-20 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
                    value={editingBody}
                    onChange={(e) => setEditingBody(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        await notesApi.update(contactId, note._id, { body: editingBody });
                        setEditingId(null);
                        load();
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm text-slate-200">{note.body}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingId(note._id);
                          setEditingBody(note.body);
                        }}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          await notesApi.remove(contactId, note._id);
                          load();
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div className="grid gap-2">
        <textarea
          className="min-h-20 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
          placeholder="Add a note..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button
          onClick={async () => {
            if (!draft.trim()) return;
            await notesApi.create(contactId, { body: draft.trim() });
            setDraft('');
            load();
          }}
        >
          Add Note
        </Button>
      </div>
    </div>
  );
}
