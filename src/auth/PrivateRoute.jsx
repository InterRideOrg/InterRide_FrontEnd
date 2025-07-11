import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth }  from './AuthContext';

/**
 * @param {string|string[]} role Lista de roles permitidos
 */
export default function PrivateRoute({ role, children }) {
  const { user } = useAuth();          // { token, role, roles:[…] }

  /* 1️⃣  Usuario no logueado */
  if (!user) return <Navigate to="/login" replace />;

  /* 2️⃣  Normalizamos el array de roles guardado */
  const userRoles   = user.roles ?? (user.role ? [user.role] : []);
  const allowed     = Array.isArray(role) ? role : [role];
  const hasAccess   = userRoles.some(r => allowed.includes(r));

  /* 3️⃣  Access granted / denied */
  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
}
