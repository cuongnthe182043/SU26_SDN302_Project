import client from './client';

export const authApi = {
  register: (payload) => client.post('/auth/register', payload),
  login: (payload) => client.post('/auth/login', payload),
  googleLogin: (credential) => client.post('/auth/google', { credential }),
  me: () => client.get('/auth/me'),
  updateProfile: (payload) => client.put('/auth/profile', payload),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => client.post(`/auth/reset-password/${token}`, { password }),
};
