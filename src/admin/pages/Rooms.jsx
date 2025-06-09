import { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import AdminLayout from '../components/AdminLayout';
import { fetchAdminRooms, deleteRoom, createRoom } from '../../api/admin';
import api from '../../api/axios';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    number: '',
    pricePerNight: '',
    description: '',
    typeId: ''
  });

  const loadRooms = () => {
    fetchAdminRooms().then(setRooms).finally(() => setLoading(false));
  };

  const loadRoomTypes = async () => {
    const res = await api.get('/api/types/all');
    setRoomTypes(res.data);
  };

  useEffect(() => {
    loadRooms();
    loadRoomTypes();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Удалить номер?')) {
      await deleteRoom(id);
      loadRooms();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { number, pricePerNight, description, typeId } = newRoom;
    if (!number || !pricePerNight || !description || !typeId) {
      return alert('Заполните все поля');
    }
    await createRoom({
      number,
      pricePerNight: parseInt(pricePerNight),
      description,
      typeId: parseInt(typeId)
    });
    setNewRoom({ number: '', pricePerNight: '', description: '', typeId: '' });
    loadRooms();
  };

  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>Номера</Typography>

      {/* Форма добавления */}
      <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <TextField
          label="Номер"
          value={newRoom.number}
          onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
        />
        <TextField
          label="Цена за ночь"
          type="number"
          value={newRoom.pricePerNight}
          onChange={e => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
        />
        <TextField
          label="Описание"
          value={newRoom.description}
          onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
        />
        <TextField
          select
          label="Тип номера"
          value={newRoom.typeId}
          onChange={e => setNewRoom({ ...newRoom, typeId: e.target.value })}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Выберите тип</MenuItem>
          {roomTypes.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.name} — {type.description}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained">Добавить</Button>
      </Box>

      {/* Таблица номеров */}
      {loading ? (
        <CircularProgress />
      ) : rooms.length === 0 ? (
        <Typography>Номеров пока нет</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Номер</strong></TableCell>
                <TableCell><strong>Цена</strong></TableCell>
                <TableCell><strong>Описание</strong></TableCell>
                <TableCell><strong>Действия</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.id}>
                  <TableCell>{room.number}</TableCell>
                  <TableCell>{room.pricePerNight}</TableCell>
                  <TableCell>{room.description}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(room.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AdminLayout>
  );
}
