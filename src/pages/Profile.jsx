import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', middleName: '', phone: '',
    gender: '', birthDate: '', passportNumber: '', address: '', citizenship: ''
  });

  const [editBookingId, setEditBookingId] = useState(null);
  const [editDates, setEditDates] = useState({ checkIn: '', checkOut: '' });

  useEffect(() => {
    api.get('/api/users/me')
      .then(res => res.data.profile && setProfile(res.data.profile))
      .catch(err => console.error('Ошибка загрузки профиля:', err));

    api.get('/api/user/bookings/my')
      .then(res => setBookings(res.data))
      .catch(err => console.error('Ошибка загрузки бронирований:', err));
  }, []);

  const handleProfileChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/api/profile/update', profile);
      alert('Профиль обновлён');
    } catch (err) {
      alert('Не удалось обновить профиль. Проверьте данные.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;
    try {
      await api.put(`/api/user/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch {
      alert('Не удалось отменить бронирование');
    }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/api/user/bookings/${id}/edit`, editDates);
      alert('Бронирование изменено');
      setEditBookingId(null);
      window.location.reload();
    } catch {
      alert('Ошибка при изменении бронирования');
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'PENDING': return 'В обработке';
      case 'ACTIVE': return 'Активно';
      case 'CANCELLED': return 'Отменено';
      case 'COMPLETED': return 'Завершено';
      default: return status;
    }
  };

  return (
    <div className="page">
      <h2>Профиль</h2>
      <p><strong>Логин:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <button onClick={logout}>Выйти</button>

      <hr />
      <h3>Настройка профиля</h3>
      <form onSubmit={handleProfileSubmit} style={{ maxWidth: '500px' }}>
  <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} placeholder="Имя" />
  <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} placeholder="Фамилия" />
  <input type="text" name="middleName" value={profile.middleName} onChange={handleProfileChange} placeholder="Отчество" />
  <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Телефон" />
  <select name="gender" value={profile.gender} onChange={handleProfileChange}>
    <option value="">Пол</option>
    <option value="Мужской">Мужской</option>
    <option value="Женский">Женский</option>
  </select>
  <input type="date" name="birthDate" value={profile.birthDate} onChange={handleProfileChange} />
  <input type="text" name="passportNumber" value={profile.passportNumber} onChange={handleProfileChange} placeholder="Паспорт" />
  <input type="text" name="address" value={profile.address} onChange={handleProfileChange} placeholder="Адрес" />
  <input type="text" name="citizenship" value={profile.citizenship} onChange={handleProfileChange} placeholder="Гражданство" />
  <br />
  <button type="submit">Сохранить</button>
</form>


      <hr />
      <h3>Мои бронирования</h3>
      {bookings.length === 0 ? (
        <p>Бронирований пока нет.</p>
      ) : (
        <ul>
          {bookings.map(b => (
            <li key={b.id}>
              <p><strong>Номер:</strong> {b.roomNumber || '—'}</p>
              <p><strong>С:</strong> {b.checkIn} <strong>по:</strong> {b.checkOut}</p>
              <p><strong>Статус:</strong> {getStatusText(b.status)}</p>
              {b.status !== 'CANCELLED' && (
                <>
                  <button onClick={() => handleCancel(b.id)}>Отменить</button>
                  {editBookingId === b.id ? (
                    <>
                      <input type="date" value={editDates.checkIn} onChange={(e) => setEditDates(d => ({ ...d, checkIn: e.target.value }))} />
                      <input type="date" value={editDates.checkOut} onChange={(e) => setEditDates(d => ({ ...d, checkOut: e.target.value }))} />
                      <button onClick={() => handleEdit(b.id)}>Сохранить</button>
                      <button onClick={() => setEditBookingId(null)}>Отмена</button>
                    </>
                  ) : (
                    <button onClick={() => {
                      setEditBookingId(b.id);
                      setEditDates({ checkIn: b.checkIn, checkOut: b.checkOut });
                    }}>Изменить</button>
                  )}
                </>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
