// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';   // ⬅︎ ya NO importa BrowserRouter
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* otras rutas */}
    </Routes>
  );
}
