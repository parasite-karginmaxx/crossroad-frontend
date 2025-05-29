import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { createBooking } from '../api/bookings';

const rooms = [
  {
    id: 1,
    title: 'Стандартный номер',
    image: 'https://source.unsplash.com/800x400/?hotel-room,standard',
    price: 4200
  },
  {
    id: 2,
    title: 'Люкс с балконом',
    image: 'https://source.unsplash.com/800x400/?luxury-hotel,room',
    price: 7600
  },
  {
    id: 3,
    title: 'Семейный номер',
    image: 'https://source.unsplash.com/800x400/?family-room,interior',
    price: 9500
  }
];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const roomId = parseInt(searchParams.get('room'));
  const room = rooms.find(r => r.id === roomId);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');

  if (!room) return <p>Номер не найден</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createBooking({
      roomId: room.id,
      checkIn,
      checkOut,
      notes
    });
    alert('Бронирование отправлено!');
    // возможно navigate('/profile') или reset формы
  };

  return (
    <div className="page">
      <h2>Бронирование: {room.title}</h2>
      <img src={room.image} alt={room.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p><strong>Цена:</strong> {room.price} ₽ / ночь</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <label>Дата заезда:</label><br />
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
        </div>
        <div>
          <label>Дата отъезда:</label><br />
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
        </div>
        <div>
          <label>Дополнительная информация:</label><br />
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Подтвердить бронирование</button>
      </form>
    </div>
  );
}
