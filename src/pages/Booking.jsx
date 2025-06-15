import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, getAllAdditions } from '../api/booking';
import {
  Container, Typography, TextField, Button, Snackbar, Alert, Box,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';

export default function Booking() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('rooms');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [additionIds, setAdditionIds] = useState([]);
  const [allAdditions, setAllAdditions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    getAllAdditions()
      .then(setAllAdditions)
      .catch(() => showSnackbar('Ошибка при загрузке услуг', 'error'));
  }, []);

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
      await createBooking({ checkIn, checkOut, roomId, additionIds });
      showSnackbar('Бронирование успешно оформлено!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.log('Ошибка:', err.response);
      const msg = err?.response?.data?.message || err?.response?.data;
      if (msg === 'У вас уже есть бронирование этой комнаты на выбранные даты') {
        showSnackbar('Вы уже забронировали эту комнату на указанные даты', 'error');
      } else if (msg === 'Комната уже забронирована на выбранные даты') {
        showSnackbar('Комната недоступна на выбранные даты', 'error');
      } else if (msg?.includes('Профиль отсутствует') || msg?.includes('обязателен')) {
        showSnackbar('Пожалуйста, заполните ваш профиль перед бронированием', 'error');
      } else if (typeof msg === 'string') {
        showSnackbar(msg, 'error');
      } else {
        showSnackbar('Произошла непредвиденная ошибка.', 'error');
      }
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

        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Дополнительные услуги</InputLabel>
          <Select
            multiple
            value={additionIds}
            onChange={(e) => setAdditionIds(e.target.value)}
            input={<OutlinedInput notched label="Дополнительные услуги" />}
            renderValue={(selected) =>
              allAdditions
                .filter((add) => selected.includes(add.id))
                .map((add) => add.name)
                .join(', ')
            }
          >
            {allAdditions.map((add) => (
              <MenuItem key={add.id} value={add.id}>
                <Checkbox checked={additionIds.includes(add.id)} />
                <ListItemText primary={`${add.name} — ${add.price}₽`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Забронировать
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
