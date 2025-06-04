import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/admin/login" />;
  if (user.role !== 'ROLE_ADMIN') return <Navigate to="/" />;

  return children;
}