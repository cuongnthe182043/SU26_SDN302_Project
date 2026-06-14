import client from './client';

export const uploadApi = {
  avatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return client.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
