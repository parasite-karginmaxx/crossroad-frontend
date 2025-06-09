import { Box, Typography, Container, IconButton, Link } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#cdc9c6', py: 3, boxShadow: '0 -2px 4px rgba(0,0,0,0.1)', mt: 'auto', }} >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1, }} >
        {/* Telegram icon */}
        <IconButton component={Link} href="https://t.me/replaty" target="_blank" rel="noopener" sx={{ color: '#000' }} >
          <TelegramIcon fontSize="medium" />
        </IconButton>
        {/* Copyright */}
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Crossroads. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
}
