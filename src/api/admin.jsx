import axios from 'axios';
import adminApi from './adminAxios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://crossroad-backend.onrender.com';

export const adminRequest = async ({ username, password }) => {
  const res = await axios.post(`${BASE_URL}/api/auth/admin/login`, { username, password });
  const token = res.data.accessToken;

  if (!token) throw new Error('Admin login failed: no token received');

  localStorage.setItem('token', token);

  const decoded = jwtDecode(token);
  return {
    username: decoded.sub,
    role: decoded.role,
    token,
  };
};

export const fetchAdminRooms = async () => {
  const response = await adminApi.get('/api/rooms/all');
  return response.data;
};

export const deleteRoom = async (id) => {
  await adminApi.delete(`/api/rooms/delete/${id}`);
};

export const createRoom = async (roomData) => {
  const res = await adminApi.post('/api/rooms/add', roomData);
  return res.data;
};
