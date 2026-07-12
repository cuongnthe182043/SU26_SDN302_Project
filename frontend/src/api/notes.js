import client from './client';

export const notesApi = {
  list: (contactId) => client.get(`/contacts/${contactId}/notes`),
  create: (contactId, payload) => client.post(`/contacts/${contactId}/notes`, payload),
  update: (contactId, noteId, payload) => client.put(`/contacts/${contactId}/notes/${noteId}`, payload),
  remove: (contactId, noteId) => client.delete(`/contacts/${contactId}/notes/${noteId}`),
};
