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
    <p><strong>Логин:</strong> {user?.username}</p>
    <p><strong>Email:</strong> {user?.email}</p>
    {/* и так далее */}
  </div>
  );
}
