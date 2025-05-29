import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RoomDetails from './pages/RoomDetails';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <Header />
      <main>
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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
