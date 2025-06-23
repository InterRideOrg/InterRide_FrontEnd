// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

/* pasajero ------------------------------------------------------------ */
import PassengerHomePage from "./pages/passenger/PassengerHomePage";
import PassengerProfilePage from "./pages/passenger/PassengerProfilePage";
import RequestTripPage from "./pages/passenger/RequestTripPage";
/* driver   ------------------------------------------------------------ */
/* (cuando tengas Home + Profile del conductor los importas igual)      */

import PrivateRoute from "./auth/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";

/* bridges (redirects) ------------------------------------------------- */
import HomeRedirect from "./router/bridges/HomeRedirect";
import ProfileRedirect from "./router/bridges/ProfileRedirect";

export default function App() {
  return (
    <Routes>
      {/* -------------------------  auth públicas  --------------------- */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* -------------------------  alias genéricos -------------------- */}
      {/* /home decide a dónde ir (pasajero o conductor) */}
      <Route path="/home"    element={<HomeRedirect />} />
      {/* /profile decide el perfil correcto */}
      <Route path="/profile" element={<ProfileRedirect />} />

      {/* -------------------------  pasajero --------------------------- */}
      <Route
        path="/passenger/home"
        element={
          <PrivateRoute role="PASAJERO">
            <PassengerHomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/passenger/profile"
        element={
          <PrivateRoute role="PASAJERO">
            <PassengerProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/request-trip"
        element={
          <PrivateRoute role="PASAJERO">
            <RequestTripPage />
          </PrivateRoute>
        }
      />


      {/* -------------------------  conductor (placeholder) ------------ */}
      {/* 
      <Route
        path="/driver/home"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverHomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/driver/profile"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      /> 
      */}
    </Routes>
  );
}
