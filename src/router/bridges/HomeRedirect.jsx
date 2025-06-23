// src/router/bridges/HomeRedirect.jsx
import { Navigate } from 'react-router-dom';
import { useAuth }   from '../../auth/AuthContext';

export default function HomeRedirect() {
  const { user } = useAuth();           // { roles:['PASAJERO', ...] }

  if (!user) return <Navigate to="/login" replace />;

  if (user.roles.includes('CONDUCTOR'))
    return <Navigate to="/driver/home" replace />;
  if (user.roles.includes('ADMIN'))
    return <Navigate to="/admin/dashboard" replace />;

  /* default → pasajero */
  return <Navigate to="/passenger/home" replace />;
}
