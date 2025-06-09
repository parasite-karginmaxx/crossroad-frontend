import { Typography, Paper } from '@mui/material';
import AdminLayout from '../components/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Админ-панель
        </Typography>
        <Typography variant="subtitle1">
          Добро пожаловать, администратор! Здесь вы можете управлять пользователями, номерами и бронированиями.
        </Typography>
      </Paper>
    </AdminLayout>
  );
}
