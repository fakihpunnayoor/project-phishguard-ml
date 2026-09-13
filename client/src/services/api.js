import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const scanUrl = async (url) => {
  const response = await api.post('/scan', { url });
  return response.data;
};

export const getScanHistory = async (params = {}) => {
  const response = await api.get('/history', { params });
  return response.data;
};

export const getScanStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getScanById = async (id) => {
  const response = await api.get(`/scan/${id}`);
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
