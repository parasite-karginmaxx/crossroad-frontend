import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => setUser(data);
  
  const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    getProfile().then(data => {
      if (data) setUser(data);
    });
  }
}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
