import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#cdc9c6', color: '#000' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap',  px: { xs: 2, sm: 4 }, }} >
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', }} >
          <Box component="img" src={logo} alt="Crossroads" sx={{ height: 60 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', fontWeight: 'bold' }}>
          <Button color="inherit" component={RouterLink} to="/">Главная</Button>
          <Button color="inherit" component={RouterLink} to="/rooms">Номера</Button>
          <Button color="inherit" component={RouterLink} to="/services">Услуги</Button>
          <Button color="inherit" component={RouterLink} to="/contacts">Контакты</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, fontWeight: 'bold' }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/profile')}>Профиль</Button>
              <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>Выход</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Войти</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Регистрация</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
