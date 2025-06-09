import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Grid, Card, CardContent, CardActions, Typography, Button, Box, Snackbar, Alert} from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/rooms/all')
      .then(res => setRooms(res.data))
      .catch(err => console.error('Ошибка загрузки номеров:', err));
  }, []);

  const handleBooking = (roomId) => {
    if (!user) {
      setOpenSnackbar(true); // показываем уведомление
    } else {
      navigate(`/booking?rooms=${roomId}`);
    }
  };

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Наши номера
      </Typography>

      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid item key={room.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Номер {room.number}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {room.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {room.pricePerNight} ₽ / ночь
                </Typography>
              </CardContent>

              <CardActions sx={{ mt: 'auto', p: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: '#000', color: '#000' }}
                  onClick={() => handleBooking(room.id)}
                >
                  Забронировать
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: '#000', color: '#000' }}
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar сообщение */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setOpenSnackbar(false)}>
          Для бронирования необходимо войти в систему
        </Alert>
      </Snackbar>
    </Box>
  );
}
