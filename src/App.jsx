import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RoomDetails from './pages/RoomDetails';

import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/Dashboard';
import AdminUsers from './admin/pages/Users';
import AdminRooms from './admin/pages/Rooms';
import AdminBookings from './admin/pages/Bookings';
import AdminRoute from './admin/components/AdminRoute';

function App() {
  return (
  <Router>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
          </Routes>
        </Container>
      </Box>

      <Footer />
    </Box>
  </Router>
);
}

export default App;
