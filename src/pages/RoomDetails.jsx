import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Snackbar, Alert, CircularProgress } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/api/rooms/${id}`)
      .then(res => setRoom(res.data))
      .catch(err => console.error('Ошибка загрузки номера:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      setSnackbarOpen(true);
    } else {
      navigate(`/booking?rooms=${room.id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!room) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        Номер не найден
      </Typography>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Номер {room.number}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {room.description}
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4 }}>
        {room.pricePerNight} ₽ / ночь
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          sx={{ borderColor: '#000', color: '#000' }}
          onClick={handleBooking}
        >
          Забронировать
        </Button>
        <Button
          variant="outlined"
          sx={{ borderColor: '#000', color: '#000' }}
          onClick={() => navigate('/rooms')}
        >
          Назад к списку
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)}>
          Для бронирования необходимо авторизоваться
        </Alert>
      </Snackbar>
    </Container>
  );
}
