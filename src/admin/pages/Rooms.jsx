import { useEffect, useState } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { fetchAdminRooms, fetchRoomTypes, createRoom, updateRoom, deleteRoom } from '../../api/admin';
import RoomTypeManager from './RoomTypeManager';
import AdminLayout from '../components/AdminLayout';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeManagerOpen, setTypeManagerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    number: '',
    pricePerNight: '',
    description: '',
    capacity: '',
    floor: '',
    typeId: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const loadRooms = () => fetchAdminRooms().then(setRooms).finally(() => setLoading(false));
  const loadTypes = () => fetchRoomTypes().then(setRoomTypes);
  useEffect(() => {
    loadRooms();
    loadTypes();
  }, []);
  const openDialog = (room = null) => {
    if (room) {
      setForm({
        number: room.number,
        pricePerNight: room.pricePerNight,
        description: room.description,
        capacity: room.capacity,
        floor: room.floor,
        typeId: room.typeId ?? ''
      });
      setEditingId(room.id);
    } else {
      setForm({ number: '', pricePerNight: '', description: '', capacity: '', floor: '', typeId: '' });
      setEditingId(null);
    }
    setDialogOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      number: form.number.trim(),
      pricePerNight: parseInt(form.pricePerNight),
      description: form.description,
      capacity: parseInt(form.capacity),
      floor: parseInt(form.floor),
      typeId: parseInt(form.typeId)
    };
    try {
      if (editingId) {
        await updateRoom(editingId, payload);
        setSnackbar({ open: true, message: 'Номер обновлён', severity: 'success' });
      } else {
        await createRoom(payload);
        setSnackbar({ open: true, message: 'Номер добавлен', severity: 'success' });
      }
      setDialogOpen(false);
      setEditingId(null);
      loadRooms();
    } catch {
      setSnackbar({ open: true, message: 'Ошибка при сохранении', severity: 'error' });
    }
  };
  const handleDelete = async (id) => {
    if (confirm('Удалить номер?')) {
      await deleteRoom(id);
      setSnackbar({ open: true, message: 'Номер удалён', severity: 'info' });
      loadRooms();
    }
  };
  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>Номера</Typography>
      <Button variant="contained" onClick={() => openDialog()} sx={{ mr: 2 }}>
        Добавить номер
      </Button>
      <Button variant="outlined" onClick={() => setTypeManagerOpen(true)}>
        Управление типами номеров
      </Button>
      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Номер</TableCell>
                <TableCell>Этаж</TableCell>
                <TableCell>Вместимость</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.id}>
                  <TableCell>{room.number}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.pricePerNight}</TableCell>
                  <TableCell>{room.description}</TableCell>
                  <TableCell>{room.typeName || '—'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openDialog(room)}>Изменить</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(room.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Редактирование номера' : 'Добавление номера'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Номер" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required />
            <TextField label="Этаж" type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} required />
            <TextField label="Вместимость" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
            <TextField label="Цена за ночь" type="number" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} required />
            <TextField label="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <TextField select label="Тип номера" value={form.typeId} onChange={e => setForm({ ...form, typeId: e.target.value })} required>
              <MenuItem value="">Выберите тип</MenuItem>
              {roomTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name} — {type.description}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button type="submit" variant="contained">{editingId ? 'Сохранить' : 'Добавить'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <RoomTypeManager open={typeManagerOpen} onClose={() => setTypeManagerOpen(false)} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
