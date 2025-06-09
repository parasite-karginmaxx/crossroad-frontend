import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/booking';

export default function Booking() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('rooms');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];

    if (!checkIn || !checkOut || !roomId) {
      return alert('Пожалуйста, заполните все поля');
    }

    if (checkIn < today || checkOut < today) {
      return alert('Нельзя бронировать на прошедшие даты');
    }

    if (checkOut <= checkIn) {
      return alert('Дата выезда должна быть позже даты заезда');
    }

    try {
      await createBooking({ checkIn, checkOut, roomId });
      alert('Бронирование успешно оформлено!');
      navigate('/profile');
    } catch (err) {
      console.error('Ошибка бронирования:', err?.response?.data?.message || err);
      alert('Не удалось оформить бронирование. Возможно, номер уже занят на выбранные даты или в вашем профиле не указана личная информация.');
    }
  };

  return (
    <div className="page">
      <h2>Бронирование номера</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>
          Дата заезда:
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Дата выезда:
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Забронировать</button>
      </form>
    </div>
  );
}
