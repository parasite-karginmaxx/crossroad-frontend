import { Link } from 'react-router-dom';

export default function AdminLayout({ children }) {
  return (
    <div>
      <nav style={{ padding: '10px', background: '#222', color: '#fff' }}>
        <Link to="/admin/Dashboard" style={{ marginRight: '15px', color: '#fff' }}>Главная</Link>
        <Link to="/admin/Users" style={{ marginRight: '15px', color: '#fff' }}>Пользователи</Link>
        <Link to="/admin/Rooms" style={{ marginRight: '15px', color: '#fff' }}>Номера</Link>
        <Link to="/admin/Bookings" style={{ marginRight: '15px', color: '#fff' }}>Бронирования</Link>
      </nav>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}