import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBookings = () => {
    adminApi.get('/api/admin/bookings/all')
      .then(res => setBookings(res.data))
      .catch(() => showSnackbar('Ошибка загрузки бронирований', 'error'))
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
      showSnackbar(`Статус обновлён: ${statusLabels[status]}`, 'success');
    } catch (err) {
      showSnackbar('Не удалось изменить статус', 'error');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить бронирование?')) return;
    try {
      await adminApi.delete(`/api/admin/bookings/${id}/delete`);
      fetchBookings();
      showSnackbar('Бронирование удалено', 'success');
    } catch {
      showSnackbar('Не удалось удалить бронирование', 'error');
    }
  };

  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>Бронирования</Typography>

      {loading ? (
        <CircularProgress />
      ) : bookings.length === 0 ? (
        <Typography>Бронирований пока нет.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Номер</strong></TableCell>
                <TableCell><strong>Клиент</strong></TableCell>
                <TableCell><strong>Дата заезда</strong></TableCell>
                <TableCell><strong>Дата выезда</strong></TableCell>
                <TableCell><strong>Статус</strong></TableCell>
                <TableCell><strong>Действия</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.roomNumber || '—'}</TableCell>
                  <TableCell>{booking.username || '—'}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>{statusLabels[booking.status] || booking.status}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        disabled={booking.status === 'CONFIRMED'}
                      >
                        Подтвердить
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => updateStatus(booking.id, 'REJECTED')}
                        disabled={booking.status === 'REJECTED'}
                      >
                        Отклонить
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
