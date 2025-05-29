import axios from 'axios';

// Получить все бронирования пользователя
export const getUserBookings = async () => {
  const response = await axios.get('/api/bookings/my');
  return response.data;
};

// Создать новое бронирование
export const createBooking = async (bookingData) => {
  const response = await axios.post('/api/bookings', bookingData);
  return response.data;
};
