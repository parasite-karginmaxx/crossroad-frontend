import { useParams, useNavigate } from 'react-router-dom';

const rooms = [
  { id: 1, title: 'Стандартный номер', description: 'Уютный номер с одной двуспальной кроватью и видом на сад. Идеально подходит для одиночных путешественников и пар.', price: 4200, image: 'https://source.unsplash.com/800x400/?hotel-room,standard' },
  { id: 2, title: 'Люкс с балконом', description: 'Просторный номер с балконом, мини-баром и кондиционером. Отличный выбор для комфортного отдыха.', price: 7600, image: 'https://source.unsplash.com/800x400/?luxury-hotel,room' },
  { id: 3, title: 'Семейный номер', description: 'Две комнаты, кухня, идеален для семьи из 3-4 человек. Максимальный комфорт и пространство.', price: 9500, image: 'https://source.unsplash.com/800x400/?family-room,interior' }
];

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = rooms.find(r => r.id === parseInt(id));

  if (!room) return <p>Номер не найден</p>;

  return (
    <div className="page">
      <h2>{room.title}</h2>
      <img src={room.image} alt={room.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p>{room.description}</p>
      <p><strong>Цена: {room.price} ₽ / ночь</strong></p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/booking?room=' + room.id)}>Забронировать</button>
        <button onClick={() => navigate('/rooms')}>Назад</button>
      </div>
    </div>
  );
}
