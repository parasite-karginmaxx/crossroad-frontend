import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminRequest } from '../../api/admin';
import { jwtDecode } from 'jwt-decode';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await adminRequest({ username, password });
      const decoded = jwtDecode(userData.token);
      const extractedRole = decoded.role || decoded.auth || decoded.authorities?.[0] || '';
      if (extractedRole) {
        localStorage.setItem("role", extractedRole);
      }
      if (extractedRole !== 'ROLE_ADMIN') {
        setSnackbar({ open: true, message: 'У вас нет доступа к админ-панели', severity: 'error' });
        return;
      }
      login(userData);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Ошибка входа', severity: 'error' });
    }
  };
  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Вход в админ-панель
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit"
            variant="outlined"
            fullWidth
            sx={{ borderColor: '#000', color: '#000' }}>
          Войти
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
