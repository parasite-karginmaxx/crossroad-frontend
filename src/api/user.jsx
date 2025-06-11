import api from 'axios';

export const getUserProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await api.put('/profile', profileData);
  return res.data;
};
