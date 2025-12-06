import api from '../utils/axios';

export const orderService = {
  create: async (payload) => {
    const response = await api.post('/orders', payload);
    return response.data.data;
  },

  getAll: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data.data;
  },
};
