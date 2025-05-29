import api from './axios';

export const loginRequest = async ({ username, password }) => {
  const res = await api.post('/api/auth/login', { username, password });

  // 1. Сохраняем токен
  const token = res.data.token;
  localStorage.setItem('token', token);

  // 2. Получаем профиль
  const profileRes = await api.get('/api/users/me');
  return profileRes.data; // возвращаем данные пользователя
};

export const registerRequest = async (email, password) => {
  // Здесь будет POST /api/auth/register
  return { email };
};

export const logoutRequest = async () => {
  // Здесь будет POST /api/auth/logout
};

export const getProfile = async () => {
  const res = await api.get('/api/users/me');
  
  return res.data;
};

  