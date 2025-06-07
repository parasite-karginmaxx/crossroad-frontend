import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest, loginRequest, getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerRequest({ username, email, password });
      alert('Вы успешно зарегистрированы!');

      const loginData = await loginRequest({ username, password });
      const fullProfile = await getProfile(); // <=== загрузим email из БД

      login({ ...loginData, email: fullProfile.email }); // передадим в AuthContext
      navigate('/profile');
    } catch (err) {
      console.error('Ошибка регистрации', err);
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="page">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}
