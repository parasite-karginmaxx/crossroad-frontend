import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Snackbar, Alert, IconButton
} from '@mui/material';
import {
  fetchRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType
} from '../../api/admin';

export default function RoomTypeManager({ open, onClose }) {
  const [types, setTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadTypes = () => {
    fetchRoomTypes().then(setTypes);
  };

  useEffect(() => {
    if (open) loadTypes();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRoomType(editingId, form);
        setSnackbar({ open: true, message: 'Тип обновлён', severity: 'success' });
      } else {
        await createRoomType(form);
        setSnackbar({ open: true, message: 'Тип добавлен', severity: 'success' });
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      loadTypes();
    } catch {
      setSnackbar({ open: true, message: 'Ошибка при сохранении', severity: 'error' });
    }
  };

  const handleEdit = (type) => {
    setForm({ name: type.name, description: type.description });
    setEditingId(type.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить тип?')) {
      await deleteRoomType(id);
      setSnackbar({ open: true, message: 'Тип удалён', severity: 'info' });
      loadTypes();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Управление типами номеров</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '1rem' }}>
            <TextField
              label="Название"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Описание"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              fullWidth
              required
            />
            <Button variant="contained" type="submit">
              {editingId ? 'Сохранить изменения' : 'Добавить'}
            </Button>
          </form>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Название</strong></TableCell>
                  <TableCell><strong>Описание</strong></TableCell>
                  <TableCell><strong>Действия</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {types.map(type => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.description}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleEdit(type)}>Изменить</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(type.id)}>Удалить</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
