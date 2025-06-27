import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /**
   * Estructura estándar que manejaremos en toda la app ⬇︎
   * {
   *   token   : '…JWT…',
   *   role    : 'PASAJERO' | 'CONDUCTOR' | 'ADMIN',
   *   roles   : ['PASAJERO']   // siempre array para los guards
   *   userId  : 23             // opcional - útil para rutas dinámicas
   * }
   */
const [user, setUser] = useState(() => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  if (token && role && userId) {
    return {
      token,
      role,
      roles: [role],
      userId: parseInt(userId)
    };
  }

  return null;
});


  /* -------------------------------------------------- */
  const login = (dataFromApi) => {
    // Si el backend devuelve sólo «role», lo convertimos a array «roles»
    const rolesArr = dataFromApi.roles ?? [dataFromApi.role];

    setUser({
      ...dataFromApi,
      roles: rolesArr
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };
  /* -------------------------------------------------- */

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
