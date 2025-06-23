// src/router/bridges/ProfileRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth }  from "../../auth/AuthContext";

/**
 * Redirige a /passenger/profile o /driver/profile
 * según el primer rol que encuentre en el usuario.
 * Si no hay sesión, envía a /login.
 */
export default function ProfileRedirect() {
  const { user } = useAuth();          // { roles: [...] }

  if (!user) return <Navigate to="/login" replace />;

  const target = user.roles.includes("CONDUCTOR")
    ? "/driver/profile"
    : "/passenger/profile";

  return <Navigate to={target} replace />;
}
