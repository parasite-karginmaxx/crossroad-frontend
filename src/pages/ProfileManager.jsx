import { useEffect, useState } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, Grid
} from '@mui/material';
import { getUserProfile, updateUserProfile } from '../api/user';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData(data);
    } catch {
      showSnackbar('Ошибка загрузки профиля', 'error');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      showSnackbar('Профиль обновлён');
      fetchProfile();
      setEditOpen(false);
    } catch {
      showSnackbar('Ошибка при сохранении', 'error');
    }
  };

  if (!profile) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Профиль</Typography>
      <Typography>Логин: {profile.username}</Typography>
      <Typography>Email: {profile.email}</Typography>

      <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setEditOpen(true)}>
        Редактировать профиль
      </Button>

      {/* Модалка */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Редактирование профиля</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[
              ['firstName', 'Имя'],
              ['lastName', 'Фамилия'],
              ['middleName', 'Отчество'],
              ['phone', 'Телефон'],
              ['passportNumber', 'Паспорт'],
              ['address', 'Адрес'],
              ['citizenship', 'Гражданство'],
              ['birthDate', 'Дата рождения']
            ].map(([key, label]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={label}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Закрыть</Button>
          <Button variant="contained" onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
