import api from './axios';
import { jwtDecode } from 'jwt-decode';

export const loginRequest = async ({ username, password }) => {
  console.log('Logging in with:', { username, password });
  const res = await api.post('/api/auth/login', { username, password });

  const { accessToken, refreshToken } = res.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  const decoded = jwtDecode(accessToken);
  return {
    username: decoded.sub,
    role: decoded.role || decoded.auth || decoded.authorities?.[0],
  };
};

export const registerRequest = async ({ username, email, password }) => {
  const res = await api.post('/api/auth/register', { username, email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/api/users/me');
  return res.data;
};
export const verifyEmailCode = async ({ email, code }) => {
  const res = await api.post('/api/auth/verify-code', { email, code });
  return res.data;
};