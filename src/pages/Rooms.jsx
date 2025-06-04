import { useNavigate } from 'react-router-dom';

const rooms = [
  { id: 1, title: 'Стандартный номер', description: 'Уютный номер...', price: 4200},
  { id: 2, title: 'Люкс с балконом', description: 'Просторный номер...', price: 7600},
  { id: 3, title: 'Семейный номер', description: 'Две комнаты...', price: 9500}
];

export default function Rooms() {
    const navigate = useNavigate();
  
    return (
      <div className="page">
        <h2>Наши номера</h2>
        <div className="room-list">
          {rooms.map(room => (
            <div className="room-card" key={room.id}>
              <h3>{room.title}</h3>
              <p>{room.description}</p>
              <p><strong>Цена: {room.price} ₽ / ночь</strong></p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
                <button onClick={() => navigate(`/booking?room=${room.id}`)}>Забронировать</button>
                <button onClick={() => navigate(`/rooms/${room.id}`)}>Просмотр</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
