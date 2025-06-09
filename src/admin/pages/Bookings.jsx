import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import adminApi from '../../api/adminAxios';

const statusLabels = {
  PENDING: 'В обработке',
  CONFIRMED: 'Подтверждено',
  REJECTED: 'Отклонено',
  CANCELLED: 'Отменено',
  ACTIVE: 'Активно',
  COMPLETED: 'Завершено',
  EXTENSION_REQUESTED: 'Запрошено продление'
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    adminApi.get('/api/admin/bookings/all')
      .then(res => setBookings(res.data))
      .catch(err => console.error('Ошибка загрузки бронирований', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminApi.put(`/api/admin/bookings/${id}/status`, null, {
        params: { status }
      });
      fetchBookings();
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      alert('Не удалось изменить статус');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить бронирование?')) return;
    try {
      await adminApi.delete(`/api/admin/bookings/${id}/delete`);
      fetchBookings();
    } catch (err) {
      console.error('Ошибка удаления бронирования:', err);
      alert('Не удалось удалить бронирование');
    }
  };

  return (
    <AdminLayout>
      <h2>Бронирования</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : bookings.length === 0 ? (
        <p>Бронирований пока нет.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Номер</th>
              <th>Клиент</th>
              <th>Дата заезда</th>
              <th>Дата выезда</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.roomNumber || '—'}</td>
                <td>{booking.username || '—'}</td>
                <td>{booking.checkIn}</td>
                <td>{booking.checkOut}</td>
                <td>{statusLabels[booking.status] || booking.status}</td>
                <td>
                  <button
                    onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                    disabled={booking.status === 'CONFIRMED'}
                  >
                    Подтвердить
                  </button>{' '}
                  <button
                    onClick={() => updateStatus(booking.id, 'REJECTED')}
                    disabled={booking.status === 'REJECTED'}
                  >
                    Отклонить
                  </button>{' '}
                  <button onClick={() => deleteBooking(booking.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
