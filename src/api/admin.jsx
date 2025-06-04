import api from './axios';
import { jwtDecode } from 'jwt-decode';

export const adminRequest = async ({ username, password }) => {
  const res = await api.post('/api/auth/admin/login', { username, password });
  const token = res.data.token;

  localStorage.setItem('token', token);

  const decoded = jwtDecode(token);
  const role = decoded.role || decoded.auth || decoded.authorities?.[0] || '';
  const login = decoded.sub; // по JWT стандарту

  return {
    token,
    username: login,
    role
  };
};

export const fetchAdminRooms = async () => {
  const response = await api.get('/api/rooms/all');
  return response.data;
};
export const deleteRoom = async (id) => {
  await api.delete(`/api/rooms/delete/${id}`);
};

export const createRoom = async (roomData) => {
  const res = await api.post('/api/rooms/add', roomData);
  return res.data;
};
