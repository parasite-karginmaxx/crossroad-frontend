import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Snackbar, Alert
} from '@mui/material';
import { getAllAdminAdditions, addAdminAddition, editAdminAddition, deleteAdminAddition } from '../../api/admin';

export default function AdditionManager({ open, onClose }) {
  const [additions, setAdditions] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const fetchAdditions = () => {
    getAllAdminAdditions()
      .then(setAdditions)
      .catch(() => showSnackbar('Ошибка загрузки услуг', 'error'));
  };
  useEffect(() => {
    if (open) fetchAdditions();
  }, [open]);
  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) return showSnackbar('Введите название и цену', 'warning');
    try {
      if (editingId) {
        await editAdminAddition(editingId, { name, price });
        showSnackbar('Услуга обновлена', 'success');
      } else {
        await addAdminAddition({ name, price });
        showSnackbar('Услуга добавлена', 'success');
      }
      setName('');
      setPrice('');
      setEditingId(null);
      fetchAdditions();
    } catch {
      showSnackbar('Ошибка при сохранении услуги', 'error');
    }
  };
  const handleEdit = (add) => { setName(add.name); setPrice(add.price); setEditingId(add.id); };
  const handleDelete = async (id) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      await deleteAdminAddition(id);
      showSnackbar('Услуга удалена', 'success');
      fetchAdditions();
    } catch {
      showSnackbar('Ошибка при удалении', 'error');
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Управление услугами</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
          required
        />
        <Button fullWidth variant="contained" sx={{ my: 2 }} onClick={handleSubmit}>
          {editingId ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ'}
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Название</strong></TableCell>
                <TableCell><strong>Цена</strong></TableCell>
                <TableCell><strong>Действия</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {additions.map((add) => (
                <TableRow key={add.id}>
                  <TableCell>{add.name}</TableCell>
                  <TableCell>{add.price} ₽</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(add)}>Изменить</Button>
                    <Button color="error" onClick={() => handleDelete(add.id)}>Удалить</Button>
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
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
