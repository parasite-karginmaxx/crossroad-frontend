import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Container, Typography, Button, TextField, Select, MenuItem,
  Grid, Snackbar, Alert, Box, Divider
} from '@mui/material';

export default function Profile() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', middleName: '', phone: '',
    gender: '', birthDate: '', passportNumber: '', address: '', citizenship: ''
  });

  const [editBookingId, setEditBookingId] = useState(null);
  const [editDates, setEditDates] = useState({ checkIn: '', checkOut: '' });

  useEffect(() => {
    api.get('/api/users/me')
      .then(res => res.data.profile && setProfile(res.data.profile))
      .catch(() => showSnackbar('Ошибка загрузки профиля', 'error'));

    api.get('/api/user/bookings/my')
      .then(res => setBookings(res.data))
      .catch(() => showSnackbar('Ошибка загрузки бронирований', 'error'));
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/api/profile/update', profile);
      showSnackbar('Профиль обновлён');
    } catch {
      showSnackbar('Не удалось обновить профиль', 'error');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;
    try {
      await api.put(`/api/user/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      showSnackbar('Бронирование отменено');
    } catch {
      showSnackbar('Ошибка отмены', 'error');
    }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/api/user/bookings/${id}/edit`, editDates);
      showSnackbar('Бронирование изменено');
      setEditBookingId(null);
      window.location.reload();
    } catch {
      showSnackbar('Ошибка при изменении', 'error');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'В обработке';
      case 'ACTIVE': return 'Активно';
      case 'CANCELLED': return 'Отменено';
      case 'COMPLETED': return 'Завершено';
      default: return status;
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Профиль</Typography>
      <Typography>Логин: {user?.username}</Typography>
      <Typography>Email: {user?.email}</Typography>
      <Button onClick={logout} variant="outlined" sx={{ mt: 1 }}>Выйти</Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Редактирование профиля</Typography>
      <Box component="form" onSubmit={handleProfileSubmit} sx={{ maxWidth: 600 }}>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'middleName', 'phone', 'passportNumber', 'address', 'citizenship'].map((field, i) => (
            <Grid item xs={12} sm={field === 'address' ? 12 : 6} key={i}>
              <TextField
                fullWidth name={field}
                label={field}
                value={profile[field]}
                onChange={handleProfileChange}
              />
            </Grid>
          ))}
          <Grid item xs={6}>
            <Select fullWidth name="gender" value={profile.gender} onChange={handleProfileChange} displayEmpty>
              <MenuItem value="">Пол</MenuItem>
              <MenuItem value="Мужской">Мужской</MenuItem>
              <MenuItem value="Женский">Женский</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="date" name="birthDate" value={profile.birthDate} onChange={handleProfileChange} />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>Сохранить</Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Мои бронирования</Typography>
      {bookings.length === 0 ? (
        <Typography>Бронирований пока нет.</Typography>
      ) : (
        bookings.map(b => (
          <Box key={b.id} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography><strong>Номер:</strong> {b.roomNumber || '—'}</Typography>
            <Typography><strong>С:</strong> {b.checkIn} <strong>по:</strong> {b.checkOut}</Typography>
            <Typography><strong>Статус:</strong> {getStatusText(b.status)}</Typography>

            {b.status !== 'CANCELLED' && (
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" onClick={() => handleCancel(b.id)}>Отменить</Button>

                {editBookingId === b.id ? (
                  <>
                    <TextField type="date" value={editDates.checkIn} onChange={e => setEditDates(d => ({ ...d, checkIn: e.target.value }))} />
                    <TextField type="date" value={editDates.checkOut} onChange={e => setEditDates(d => ({ ...d, checkOut: e.target.value }))} />
                    <Button onClick={() => handleEdit(b.id)}>Сохранить</Button>
                    <Button onClick={() => setEditBookingId(null)}>Отмена</Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setEditBookingId(b.id);
                    setEditDates({ checkIn: b.checkIn, checkOut: b.checkOut });
                  }}>Изменить</Button>
                )}
              </Box>
            )}
          </Box>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
