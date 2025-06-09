import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/booking';
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box
} from '@mui/material';

export default function Booking() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('rooms');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];

    if (!checkIn || !checkOut || !roomId) {
      return showSnackbar('Пожалуйста, заполните все поля', 'warning');
    }

    if (checkIn < today || checkOut < today) {
      return showSnackbar('Нельзя бронировать на прошедшие даты', 'warning');
    }

    if (checkOut <= checkIn) {
      return showSnackbar('Дата выезда должна быть позже даты заезда', 'warning');
    }

    try {
      await createBooking({ checkIn, checkOut, roomId });
      showSnackbar('Бронирование успешно оформлено!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error('Ошибка бронирования:', err);
      showSnackbar(
        'Не удалось оформить бронирование. Возможно, номер уже занят на выбранные даты или в вашем профиле не указана личная информация.',
        'error'
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>Бронирование номера</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Дата заезда"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Дата выезда"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Забронировать
        </Button>
      </Box>

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
