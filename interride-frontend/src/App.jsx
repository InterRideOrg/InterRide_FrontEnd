import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';   // o la ruta donde lo guardaste

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Ejemplo de futuras vistas */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      {/* catch-all → redirige a /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
