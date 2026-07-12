import client from './client';

export const contactsApi = {
  list: (params) => client.get('/contacts', { params }),
  get: (id) => client.get(`/contacts/${id}`),
  create: (payload) => client.post('/contacts', payload),
  update: (id, payload) => client.put(`/contacts/${id}`, payload),
  remove: (id) => client.delete(`/contacts/${id}`),
  toggleFavorite: (id) => client.patch(`/contacts/${id}/favorite`),
  toggleBlacklist: (id) => client.patch(`/contacts/${id}/blacklist`),
  recent: (params) => client.get('/contacts/recent', { params }),
  nearby: (params) => client.get('/contacts/nearby', { params }),
  suggestAddress: (text) => client.get('/contacts/address-suggestions', { params: { text } }),
};
