import api from '../utils/axios';

export const productService = {
  create: async (payload) => {
    const response = await api.post('/products', payload);
    return response.data.data;
  },

  getAll: async () => {
    const response = await api.get('/products');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/products/${id}`, payload);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  },
};
