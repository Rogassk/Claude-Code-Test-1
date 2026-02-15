import apiClient from './client';

export const authApi = {
  signup: (data) => apiClient.post('/auth/signup', data).then((r) => r.data),
  login: (data) => apiClient.post('/auth/login', data).then((r) => r.data),
  logout: (refreshToken) => apiClient.post('/auth/logout', { refreshToken }).then((r) => r.data),
  refresh: (refreshToken) =>
    apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (data) =>
    apiClient.post('/auth/reset-password', data).then((r) => r.data),
  getProfile: () => apiClient.get('/auth/me').then((r) => r.data),
};
