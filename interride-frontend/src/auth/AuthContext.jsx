// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //const [user, setUser] = useState(null);   // { id, name, roles: [] }

//-->>QUITAR CUANDO SE PRUEBE CON BACKEND USUARIO DE PRUEBA
  const [user, setUser] = useState(() => ({
    id: 1,
    name: 'Juan',
    roles: ['PASAJERO']
  }));
//--->QUITAR CUANDO SE PRUEBE CON BACKEND

  /* mocks de login/logout */
  const login  = (u) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* 🔑 named export */
export const useAuth = () => useContext(AuthContext);
