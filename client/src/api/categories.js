import apiClient from './client';

export const categoriesApi = {
  list: () => apiClient.get('/categories').then((r) => r.data),
  create: (data) => apiClient.post('/categories', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data).then((r) => r.data),
  delete: (id) => apiClient.delete(`/categories/${id}`).then((r) => r.data),
};
