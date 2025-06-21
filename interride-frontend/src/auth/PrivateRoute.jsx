// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth }  from "./AuthContext";

/**
 * @param {string|string[]} role  Uno o varios roles permitidos
 */
export default function PrivateRoute({ role, children }) {
  const { user } = useAuth();          // { roles:[…] }

  if (!user) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(role) ? role : [role];
  const hasAccess = user.roles.some(r => allowed.includes(r));

  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
}
