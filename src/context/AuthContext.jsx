import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (data) => setUser(data);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const adminToken = localStorage.getItem('token');

    try {
      if (accessToken && refreshToken) {
        getProfile()
          .then(data => {
            setUser({
              username: data.username,
              email: data.email,
              role: data.role.role,
              profile: data.profile,
            });
          })
          .catch(err => console.error('Ошибка получения профиля:', err));
      } else if (adminToken) {
        const decoded = jwtDecode(adminToken);
        setUser({
          username: decoded.sub,
          role: decoded.role,
        });
      }
    } catch (err) {
      console.warn('Невалидный токен. Очистка...');
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
