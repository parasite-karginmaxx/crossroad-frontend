import { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import { fetchUsers, deleteUser, blockUser } from '../../api/admin';
import AdminLayout from '../components/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadUsers = () => {
    fetchUsers().then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Удалить пользователя?')) {
      await deleteUser(id);
      setSnackbar({ open: true, message: 'Пользователь удалён', severity: 'info' });
      loadUsers();
    }
  };

  const handleBlock = async (id) => {
    if (confirm('Заблокировать пользователя?')) {
      await blockUser(id);
      setSnackbar({ open: true, message: 'Пользователь заблокирован', severity: 'warning' });
      loadUsers();
    }
  };

  const translateRole = (role) => {
    return role === 'ROLE_ADMIN' ? 'Админ' : 'Пользователь';
  };

  const translateStatus = (status) => {
    if (!status || status === 'ACTIVE') return 'Активен';
    if (status === 'BLOCKED') return 'Заблокирован';
    if (status === 'PENDING') return 'Ожидает подтверждения';
    return '—';
  };

  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>Пользователи</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Логин</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{translateStatus(user.status)}</TableCell>
                <TableCell>{translateRole(user.role)}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDelete(user.id)}>
                    Удалить
                  </Button>
                  {(user.status === 'ACTIVE' || !user.status) && (
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => handleBlock(user.id)}
                      sx={{ ml: 1 }}
                    >
                      Заблокировать
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
