// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";


/* -------------- landing -------------- */
import LandingPage from "./pages/LandingPage";

/* -------------- auth -------------- */
import LoginPage from "./pages/auth/LoginPage";
import RegisterDriverPage from "./pages/auth/RegisterDriverPage";
import RegisterPassengerPage from "./pages/auth/RegisterPassengerPage";
import RegisterVehiclePage from "./pages/auth/RegisterVehiclePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

/* pasajero ------------------------------------------------------------ */
import PassengerHomePage from "./pages/passenger/PassengerHomePage";
import PassengerProfilePage from "./pages/passenger/PassengerProfilePage";
import RequestTripPage from "./pages/passenger/RequestTripPage";
import HistoryPage  from "./pages/passenger/HistoryPage";
import TicketDetailPage from "./pages/passenger/TicketDetailPage";
/* driver   ------------------------------------------------------------ */

 import DriverProfilePage from "./pages/driver/DriverProfilePage";
/* (cuando tengas Home + Profile del conductor los importas igual)      */

import PrivateRoute from "./auth/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";

/* bridges (redirects) ------------------------------------------------- */
import HomeRedirect from "./router/bridges/HomeRedirect";
import ProfileRedirect from "./router/bridges/ProfileRedirect";

export default function App() {
  return (
    <Routes>
      {/* landing público */}
      <Route path="/" element={<LandingPage />} />
      
      {/* -------------------------  auth públicas  --------------------- */}
      <Route path="/login"           element={<LoginPage />} />

      <Route path="/register-passenger" element={<RegisterPassengerPage />} />
      <Route path="/register-driver"    element={<RegisterDriverPage />}   />
      <Route path="/register-vehicle"   element={<RegisterVehiclePage />}  />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* -------------------------  alias genéricos -------------------- */}
      {/* /home decide a dónde ir (pasajero o conductor) */}
      <Route path="/home"    element={<HomeRedirect />} />
      {/* /profile decide el perfil correcto */}
      <Route path="/profile" element={<ProfileRedirect />} />

      {/* -------------------------  pasajero --------------------------- */}
      <Route
        path="/passenger/home/:userId"
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

      <Route
        path="/passenger/history"
        element={
          <PrivateRoute role="PASAJERO">
            <HistoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/tickets/:pasajeroId/:viajeId"
        element={
          <PrivateRoute role="PASAJERO">
            <TicketDetailPage />
          </PrivateRoute>
        }
      />
      


      {/* -------------------------  conductor (placeholder) ------------ */}
      {/* 
      <Route
        path="/driver/home/:userId"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverHomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

*/


      <Route
        path="/driver/profile/:userId"
        element={
          <PrivateRoute role="PASAJERO">
            <MainLayout>
              <DriverProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      /> 
      }
    </Routes>
  );
}
