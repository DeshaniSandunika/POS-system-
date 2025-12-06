import api from '../utils/axios';

export const categoryService = {
  create: async (payload) => {
    const response = await api.post('/categories', payload);
    return response.data.data;
  },

  getAll: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/categories/${id}`, payload);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
  },
};
