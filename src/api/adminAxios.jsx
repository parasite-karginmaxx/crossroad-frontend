import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'https://crossroad-backend.onrender.com',
});

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
