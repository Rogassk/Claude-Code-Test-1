import apiClient from './client';

export const tasksApi = {
  list: (params = {}) => apiClient.get('/tasks', { params }).then((r) => r.data),
  getById: (id) => apiClient.get(`/tasks/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/tasks', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/tasks/${id}/status`, { status }).then((r) => r.data),
  delete: (id) => apiClient.delete(`/tasks/${id}`).then((r) => r.data),
};
