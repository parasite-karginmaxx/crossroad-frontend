import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://crossroad-backend.onrender.com/api/additions/all')
      .then(res => setServices(res.data))
      .catch(err => console.error('Ошибка при загрузке услуг:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', px: 2, py: 4  }}>Список предоставляемых услуг:</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
          <List>
            {services.map(service => (
              <ListItem key={service.id} divider>
                <ListItemText
                  primary={service.name}
                  secondary={`Цена: ${service.price} ₽`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default Services;
