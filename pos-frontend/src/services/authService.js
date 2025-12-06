import api from '../utils/axios';

export const authService = {
  login: async (payload) => {
    const response = await api.post('/users/login', payload);
    // Backend returns { success, message, data: { user, token } }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  register: async (payload) => {
    const response = await api.post('/users/register', payload);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  getAll: async () => {
    const response = await api.get('/users');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/users/${id}`, payload);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  },
};
