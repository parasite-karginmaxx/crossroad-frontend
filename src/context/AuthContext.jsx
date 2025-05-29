import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, logoutRequest } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => setUser(data);
  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  useEffect(() => {
    // Автозагрузка профиля при входе на сайт
    getProfile().then(data => {
      if (data) setUser(data);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
