import client from './client';

export const groupsApi = {
  list: () => client.get('/groups'),
  get: (id) => client.get(`/groups/${id}`),
  create: (payload) => client.post('/groups', payload),
  update: (id, payload) => client.put(`/groups/${id}`, payload),
  remove: (id) => client.delete(`/groups/${id}`),
  addContacts: (id, contactIds) => client.post(`/groups/${id}/contacts`, { contactIds }),
  removeContact: (id, contactId) => client.delete(`/groups/${id}/contacts/${contactId}`),
};
