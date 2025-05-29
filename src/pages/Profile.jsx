import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page">
      <h2>Профиль</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => { logout(); navigate('/'); }}>Выйти</button>
    </div>
  );
}
