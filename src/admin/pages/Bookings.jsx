import { useEffect, useState } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, CircularProgress, Stack, Snackbar, Alert, Box } from '@mui/material';
import AdminLayout from '../components/AdminLayout';
import AdditionManager from './AdditionManager';
import { getAllBookings, updateBookingStatus, deleteBookingById } from '../../api/admin';

const statusLabels = {
  PENDING: 'В обработке',
  CONFIRMED: 'Подтверждено',
  REJECTED: 'Отклонено',
  CANCELLED: 'Отменено',
  ACTIVE: 'Активно',
  COMPLETED: 'Завершено',
  EXTENSION_REQUESTED: 'Запрошено продление'
};
const isActionDisabled = (status, action) => {
  switch (status) {
    case 'PENDING':
      return false;
    case 'CONFIRMED':
      return action === 'confirm';
    case 'REJECTED':
    case 'CANCELLED':
    case 'ACTIVE':
    case 'COMPLETED':
      return action !== 'delete';
    case 'EXTENSION_REQUESTED':
      return false;
    default:
      return true;
  }
};
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openAdditionManager, setOpenAdditionManager] = useState(false);
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const fetchBookings = () => {
    getAllBookings()
      .then(setBookings)
      .catch(() => showSnackbar('Ошибка загрузки бронирований', 'error'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      showSnackbar('Статус обновлён', 'success');
      fetchBookings();
    } catch {
      showSnackbar('Не удалось изменить статус', 'error');
    }
  };
  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить бронирование?')) return;
    try {
      await deleteBookingById(id);
      showSnackbar('Бронирование удалено', 'success');
      fetchBookings();
    } catch {
      showSnackbar('Не удалось удалить бронирование', 'error');
    }
  };
  return (
    <AdminLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Бронирования</Typography>
        <Button variant="outlined" onClick={() => setOpenAdditionManager(true)}>
          Управление услугами
        </Button>
      </Box>
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
    <TableCell><strong>Услуги</strong></TableCell> {/* Добавлено */}
    <TableCell><strong>Статус</strong></TableCell>
    <TableCell><strong>Действия</strong></TableCell>
  </TableRow>
</TableHead>
            <TableBody>
  {bookings.map((booking) => (
    <TableRow key={booking.id}>
      <TableCell>{booking.id}</TableCell>
      <TableCell>{booking.roomNumber}</TableCell>
      <TableCell>{booking.username}</TableCell>
      <TableCell>{booking.checkIn}</TableCell>
      <TableCell>{booking.checkOut}</TableCell>
      <TableCell>
        {booking.additions?.length > 0
          ? booking.additions.map(a => a.name).join(', ')
          : '—'}
      </TableCell>
      <TableCell>{statusLabels[booking.status]}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled={isActionDisabled(booking.status, 'confirm')}
            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
          >
            Подтвердить
          </Button>
          <Button
            size="small"
            variant="contained"
            color="warning"
            disabled={isActionDisabled(booking.status, 'reject')}
            onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
          >
            Отклонить
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(booking.id)}
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
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
        <Alert  onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <AdditionManager open={openAdditionManager} onClose={() => setOpenAdditionManager(false)} />
    </AdminLayout>
  );
}
