import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.scss';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">HotelLux</div>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/rooms">Номера</Link>
        <Link to="/services">Услуги</Link>
        <Link to="/contacts">Контакты</Link>
      </nav>
      <div className="auth">
        {user ? (
          <>
            <button onClick={() => navigate('/profile')}>Профиль</button>
            <button onClick={() => { logout(); navigate('/'); }}>Выход</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Авторизация</button>
            <button onClick={() => navigate('/register')}>Регистрация</button>
          </>
        )}
      </div>
    </header>
  );
}
