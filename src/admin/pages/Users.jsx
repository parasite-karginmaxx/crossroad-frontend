import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import adminApi from '../../api/adminAxios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/api/users/all')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Ошибка загрузки пользователей', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h2>Пользователи</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : users.length === 0 ? (
        <p>Пользователи не найдены</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role?.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
