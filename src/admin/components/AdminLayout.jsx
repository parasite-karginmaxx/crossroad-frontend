import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';

export default function AdminLayout({ children }) {
  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#8a8a8a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Админ-панель
          </Typography>
          <Button color="inherit" component={Link} to="/admin/dashboard">Главная</Button>
          <Button color="inherit" component={Link} to="/admin/users">Пользователи</Button>
          <Button color="inherit" component={Link} to="/admin/rooms">Номера</Button>
          <Button color="inherit" component={Link} to="/admin/bookings">Бронирования</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingTop: 4 }}>
        {children}
      </Container>
    </div>
  );
}
