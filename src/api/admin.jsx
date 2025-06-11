import axios from 'axios';
import adminApi from './adminAxios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://crossroad-backend.onrender.com';
//
// === AUTH ===
//
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
//
// === ROOMS ===
//
export const fetchAdminRooms = () =>
  adminApi.get('/api/rooms/all').then(res => res.data);

export const createRoom = (roomData) =>
  adminApi.post('/api/admin/rooms/add', roomData);

export const updateRoom = (id, roomData) =>
  adminApi.put(`/api/admin/rooms/${id}/update`, roomData);

export const deleteRoom = (id) =>
  adminApi.delete(`/api/admin/rooms/${id}/delete`);
//
// === ROOM TYPES ===
//
export const fetchRoomTypes = () =>
  adminApi.get('/api/types/all').then(res => res.data);

export const createRoomType = (typeData) =>
  adminApi.post('/api/types/add', typeData);

export const updateRoomType = (id, typeData) =>
  adminApi.put(`/api/types/${id}/edit`, typeData);

export const deleteRoomType = (id) =>
  adminApi.delete(`/api/types/${id}/delete`);
//
// === USERS ===
//
export const fetchUsers = () =>
  adminApi.get('/api/admin/users/all').then(res => res.data);

export const deleteUser = (id) =>
  adminApi.delete(`/api/admin/users/${id}/delete`);

export const blockUser = (id) =>
  adminApi.post(`/api/admin/users/${id}/block`);
//
// === BOOKING ===
//
export const getAllBookings = () =>
  adminApi.get('/api/admin/bookings/all').then(res => res.data);

export const updateBookingStatus = (id, status) =>
  adminApi.put(`/api/admin/bookings/${id}/status`, null, {
    params: { status }
  });

export const deleteBookingById = (id) =>
  adminApi.delete(`/api/admin/bookings/${id}/delete`);
//
// === ADDITIONS ===
//
export const getAllAdminAdditions = async () => {
  const res = await adminApi.get('/api/additions/all');
  return res.data;
};

export const addAdminAddition = async (addition) => {
  const res = await adminApi.post('/api/admin/additions/add', addition);
  return res.data;
};

export const editAdminAddition = async (id, updatedAddition) => {
  const res = await adminApi.put(`/api/admin/additions/${id}/edit`, updatedAddition);
  return res.data;
};

export const deleteAdminAddition = async (id) => {
  const res = await adminApi.delete(`/api/admin/additions/${id}/delete`);
  return res.data;
};