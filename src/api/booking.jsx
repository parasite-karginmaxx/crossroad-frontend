import api from './axios';

// Получить все бронирования пользователя
export const getUserBookings = async () => {
  const res = await api.get('/api/bookings/my');
  return res.data;
};

// Получить все услуги
export const getAllAdditions = async () => {
  const res = await api.get('/api/additions/all');
  return res.data;
};

// Создать новое бронирование
export const createBooking = async ({ checkIn, checkOut, roomId, additionIds }) => {
  const safeAdditions = Array.isArray(additionIds) && additionIds.length > 0 ? additionIds : [0];

  const res = await api.post('/api/user/bookings/add', {
    checkIn,
    checkOut,
    roomId: parseInt(roomId),
    additionIds: safeAdditions
  });

  return res.data;
};

