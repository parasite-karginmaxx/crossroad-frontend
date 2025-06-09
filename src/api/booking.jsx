import api from './axios';

// Получить все бронирования пользователя
export const getUserBookings = async () => {
  const res = await api.get('/api/bookings/my');
  return res.data;
};

// Создать новое бронирование
export const createBooking = async ({ checkIn, checkOut, roomId }) => {
  const res = await api.post('/api/user/bookings/add', {
    checkIn,
    checkOut,
    roomId: parseInt(roomId)
  });
  return res.data;
};