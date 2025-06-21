// src/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth }  from './AuthContext';   //  <-- mismo directorio → "./"

export default function PrivateRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!user.roles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
}
