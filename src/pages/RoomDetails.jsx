import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/api/rooms/${id}`)
      .then(res => setRoom(res.data))
      .catch(err => console.error('Ошибка загрузки номера:', err));
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      alert('Для бронирования необходимо авторизоваться');
      navigate('/login');
    } else {
      navigate(`/booking?rooms=${room.id}`);
    }
  };

  if (!room) return <p>Номер не найден</p>;

  return (
    <div className="page">
      <h2>Номер: {room.number}</h2>
      <p>{room.description}</p>
      <p><strong>Цена: {room.pricePerNight} ₽ / ночь</strong></p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleBooking}>Забронировать</button>
        <button onClick={() => navigate('/rooms')}>Назад</button>
      </div>
    </div>
  );
}
