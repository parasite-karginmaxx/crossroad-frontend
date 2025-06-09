import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import AdminLayout from '../components/AdminLayout';
import adminApi from '../../api/adminAxios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/api/users/all')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Ошибка загрузки пользователей', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>Пользователи</Typography>

      {loading ? (
        <CircularProgress />
      ) : users.length === 0 ? (
        <Typography>Пользователи не найдены</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Логин</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Роль</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AdminLayout>
  );
}
