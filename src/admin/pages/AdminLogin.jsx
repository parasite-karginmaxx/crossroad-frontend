import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminRequest } from '../../api/admin';
import { jwtDecode } from 'jwt-decode';



export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await adminRequest({ username, password }); // username + role из токена
      const decoded = jwtDecode(userData.token);
      const extractedRole = decoded.role || decoded.auth || decoded.authorities?.[0] || '';
      if (extractedRole) {
        localStorage.setItem("role", extractedRole);
      }

      console.log('userData:', userData);

      if (extractedRole !== 'ROLE_ADMIN') {
        alert('У вас нет доступа к админ-панели');
        return;
      }

      login(userData); // сохраняем в AuthContext
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error', err);
      alert('Ошибка входа: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page">
      <h2>Вход в админ-панель</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
