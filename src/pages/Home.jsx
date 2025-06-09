import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ flex: '1 1 auto', py: 35, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Добро пожаловать в Crossroads
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Небольшой комплекс с большими возможностями
        </Typography>
        <Button variant="contained" size="large" sx={{ borderColor: '#000', color: '#000', '&:hover': {  backgroundColor: '#000',  color: '#fff',  }, }} onClick={() => navigate('/rooms')}>
          Посмотреть номера
        </Button>
      </Container>
    </Box>
  );
}
