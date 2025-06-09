import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/rooms/all')
      .then(res => setRooms(res.data))
      .catch(err => console.error('Ошибка загрузки номеров:', err));
  }, []);

  const handleBooking = (roomId) => {
    if (!user) {
      alert('Для бронирования необходимо войти в систему');
      navigate('/login');
    } else {
      navigate(`/booking?rooms=${roomId}`);
    }
  };

  return (
    <div className="page">
      <h2>Наши номера</h2>
      {rooms.map(room => (
        <div key={room.id} style={{ marginBottom: '20px' }}>
          <h3>{room.number}</h3>
          <p>{room.description}</p>
          <p><strong>Цена: {room.pricePerNight} ₽ / ночь</strong></p>
          <button onClick={() => handleBooking(room.id)}>Забронировать</button>
          <button onClick={() => navigate(`/rooms/${room.id}`)}>Просмотр</button>
        </div>
      ))}
    </div>
  );
}
