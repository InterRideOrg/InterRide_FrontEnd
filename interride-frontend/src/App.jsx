// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';   // ⬅︎ ya NO importa BrowserRouter
import LoginPage         from './pages/auth/LoginPage';
import RegisterPage      from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';

import PassengerHomePage  from './pages/passenger/PassengerHomePage';
import PrivateRoute       from './auth/PrivateRoute';   //  <-- import correcto
import MainLayout         from './components/layout/MainLayout';

export default function App() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* privadas – todas bajo MainLayout */}
      <Route
        path="/passenger/home"
        element={
          <PrivateRoute role="PASAJERO">
            <PassengerHomePage />   {/* sin AuthLayout interno */}
          </PrivateRoute>
        }
      />

      {/* admin (placeholder) */}
    </Routes>
  );
}
