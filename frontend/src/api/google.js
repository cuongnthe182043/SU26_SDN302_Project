import client from './client';

export const googleApi = {
  connect: () => client.get('/google/connect'),
  sync: () => client.post('/google/sync'),
};
