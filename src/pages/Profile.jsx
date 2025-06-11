import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Container, Typography, Button, TextField, Select, MenuItem,
  Grid, Snackbar, Alert, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import { verifyEmailCode } from '../api/auth';

export default function Profile() {
  const { user, logout, login } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', middleName: '', phone: '',
    gender: '', birthDate: '', passportNumber: '', address: '', citizenship: ''
  });

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const [editBookingId, setEditBookingId] = useState(null);
  const [editDates, setEditDates] = useState({ checkIn: '', checkOut: '', additionIds: [] });
  const [allAdditions, setAllAdditions] = useState([]);

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    api.get('/api/users/me')
      .then(res => {
        if (res.data.profile) {
          setProfile(res.data.profile);
          setFormData(res.data.profile);
        }
      })
      .catch(() => showSnackbar('Ошибка загрузки профиля', 'error'));

    api.get('/api/user/bookings/my')
      .then(res => setBookings(res.data))
      .catch(() => showSnackbar('Ошибка загрузки бронирований', 'error'));

    api.get('/api/additions/all')
      .then(res => setAllAdditions(res.data))
      .catch(() => showSnackbar('Ошибка загрузки услуг', 'error'));
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleVerifySubmit = async () => {
    try {
      await verifyEmailCode({ email: user.email, code: verifyCode });
      showSnackbar('Почта подтверждена');
      setVerifyDialogOpen(false);
      login({ ...user, verified: true });
    } catch {
      showSnackbar('Неверный код или ошибка подтверждения', 'error');
    }
  };

  const handleProfileSubmit = async () => {
    try {
      await api.patch('/api/profile/update', formData);
      setProfile(formData);
      setEditOpen(false);
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
      case 'CONFIRMED': return 'Подтверждено';
      case 'REJECTED': return 'Отклонено';
      case 'EXTENSION_REQUESTED': return 'Запрошено продление';
      default: return status;
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Профиль</Typography>
      <Typography>Логин: {user?.username}</Typography>
      <Typography>Email: {user?.email}</Typography>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button onClick={() => setEditOpen(true)} variant="contained">Редактировать профиль</Button>
        {!user?.verified && (
          <Button onClick={() => setVerifyDialogOpen(true)} variant="outlined">Подтвердить почту</Button>
        )}
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
                    <Select
                      fullWidth
                      multiple
                      value={editDates.additionIds}
                      onChange={e => setEditDates({ ...editDates, additionIds: e.target.value })}
                      input={<OutlinedInput label="Дополнительные услуги" />}
                      renderValue={(selected) => selected.map(id => {
                        const found = allAdditions.find(a => a.id === id);
                        return found ? found.name : id;
                      }).join(', ')}
                    >
                      {allAdditions.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          <Checkbox checked={editDates.additionIds.includes(a.id)} />
                          <ListItemText primary={a.name} />
                        </MenuItem>
                      ))}
                    </Select>
                    <Button onClick={() => handleEdit(b.id)}>Сохранить</Button>
                    <Button onClick={() => setEditBookingId(null)}>Отмена</Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setEditBookingId(b.id);
                    setEditDates({ checkIn: b.checkIn, checkOut: b.checkOut, additionIds: b.additionIds || [] });
                  }}>Изменить</Button>
                )}
              </Box>
            )}
          </Box>
        ))
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать профиль</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {['firstName', 'lastName', 'middleName', 'phone', 'passportNumber', 'address', 'citizenship'].map((field, i) => (
              <Grid item xs={12} sm={field === 'address' ? 12 : 6} key={i}>
                <TextField
                  fullWidth name={field}
                  label={field}
                  value={formData[field] || ''}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                />
              </Grid>
            ))}
            <Grid item xs={6}>
              <Select
                fullWidth name="gender"
                value={formData.gender || ''}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                displayEmpty
              >
                <MenuItem value="">Пол</MenuItem>
                <MenuItem value="Мужской">Мужской</MenuItem>
                <MenuItem value="Женский">Женский</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth type="date" name="birthDate"
                value={formData.birthDate || ''}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Отмена</Button>
          <Button onClick={handleProfileSubmit} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>Подтверждение почты</DialogTitle>
        <DialogContent>
          <Typography>Введите код, отправленный на вашу почту:</Typography>
          <TextField
            fullWidth
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleVerifySubmit} variant="contained">Подтвердить</Button>
        </DialogActions>
      </Dialog>

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
