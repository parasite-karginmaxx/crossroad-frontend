import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { fetchAdminRooms, deleteRoom, createRoom } from '../../api/admin';
import api from '../../api/axios'; // используем тот же axios

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    number: '',
    pricePerNight: '',
    description: '',
    typeId: ''
  });

  const loadRooms = () => {
    fetchAdminRooms().then(setRooms).finally(() => setLoading(false));
  };

  const loadRoomTypes = async () => {
    const res = await api.get('/api/types/all');
    setRoomTypes(res.data);
  };

  useEffect(() => {
    loadRooms();
    loadRoomTypes();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Удалить номер?')) {
      await deleteRoom(id);
      loadRooms();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { number, pricePerNight, description, typeId } = newRoom;
    if (!number || !pricePerNight || !description || !typeId) {
      return alert('Заполните все поля');
    }
    await createRoom({
      number,
      pricePerNight: parseInt(pricePerNight),
      description,
      typeId: parseInt(typeId)
    });
    setNewRoom({ number: '', pricePerNight: '', description: '', typeId: '' });
    loadRooms();
  };

  return (
    <AdminLayout>
      <h2>Номера</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Номер комнаты"
          value={newRoom.number}
          onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
        />
        <input
          type="number"
          placeholder="Цена за ночь"
          value={newRoom.pricePerNight}
          onChange={e => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
        />
        <input
          type="text"
          placeholder="Описание"
          value={newRoom.description}
          onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
        />
        <select
          value={newRoom.typeId}
          onChange={e => setNewRoom({ ...newRoom, typeId: e.target.value })}
        >
          <option value="">Выберите тип номера</option>
          {roomTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} — {type.description}
            </option>
          ))}
        </select>
        <button type="submit">Добавить номер</button>
      </form>

      {loading ? (
        <p>Загрузка...</p>
      ) : rooms.length === 0 ? (
        <p>Номеров пока нет</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Цена</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.number}</td>
                <td>{room.pricePerNight}</td>
                <td>{room.description}</td>
                <td>
                  <button onClick={() => handleDelete(room.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
