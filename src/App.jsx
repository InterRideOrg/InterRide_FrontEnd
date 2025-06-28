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
import PassengerHistoryPage  from "./pages/passenger/PassengerHistoryPage";
import TicketDetailPage from "./pages/passenger/TicketDetailPage";
import RateTripPage from "./pages/passenger/RateTripPage";
import AvailableTrips from "./pages/passenger/AvailableTrips";
import AvailableTripDetails from "./pages/passenger/AvailableTripDetails";
import PassengerHelpPortal from "./pages/passenger/PassengerHelpPortal";
/* driver   ------------------------------------------------------------ */
import DriverHomePage from "./pages/driver/DriverHomePage";
import DriverProfilePage from "./pages/driver/DriverProfilePage";

import DriverHelpPortal from "./pages/driver/DriverHelpPortal";
import RequestsPage from "./pages/driver/RequestsPage"; 
import RequestDetailsPage from "./pages/driver/RequestDetailsPage";
/* (cuando tengas Home + Profile del conductor los importas igual)      */
import DriverHistoryPage from "./pages/driver/DriverHistoryPage";
import DriverTripCompletedDetails from "./pages/driver/DriverTripCompletedDetails";
import PassengerCurrentTripPage from "./pages/passenger/PassengerCurrentTripPage";

/* (cuando tengas Home + Profile del conductor los importas igual)      */
import PrivateRoute from "./auth/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";

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
      <Route path="/forgot/:token" element={<ResetPasswordPage />} />

      {/* -------------------------  alias genéricos -------------------- */}
      {/* /home decide a dónde ir (pasajero o conductor) */}
       {/*<Route path="/home"    element={<HomeRedirect />} />
      {/* /profile decide el perfil correcto */}
       {/*<Route path="/profile" element={<ProfileRedirect />} />

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
        path="/passenger/profile/:userId"
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
        path="/passenger/history:userId"
        element={
          <PrivateRoute role="PASAJERO">
            <PassengerHistoryPage />
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

      <Route
        path="/trip/rate/:pasajeroId/:viajeId/:conductorId"
        element={
          <PrivateRoute role="PASAJERO">
            <RateTripPage />
          </PrivateRoute>
        }
      />
         
      <Route 
        path="/passenger/available-trips"
        element={
          <PrivateRoute role="PASAJERO">
              <AvailableTrips />
          </PrivateRoute>
        }
      />

      <Route 
        path="/passenger/available-trips/:viajeId"
        element={
          <PrivateRoute role="PASAJERO">
              <AvailableTripDetails />
          </PrivateRoute>
        }
      />

      
      <Route 
        path="/helpPassenger/:userId"
        element={
          <PrivateRoute role="PASAJERO">
              <PassengerHelpPortal />
          </PrivateRoute>
        }
      />



      <Route
        path="/passenger/current-trip/:pasajeroId/:viajeId"
        element={
         <PrivateRoute role="PASAJERO">
              <PassengerCurrentTripPage />
          </PrivateRoute>         
        }
      />  

      {/* -------------------------  conductor (placeholder) ------------ */}

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

      <Route
        path="/driver/profile/:userId"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      /> 

      <Route
        path="/helpDriver/:userId"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverHelpPortal />
            </MainLayout>
          </PrivateRoute>
        }
      /> 

      <Route
        path="/driver/requests"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <RequestsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/driver/requests/:viajeId"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <RequestDetailsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/driver/history/:userId"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverHistoryPage />
            </MainLayout>
          </PrivateRoute>
        }
      /> 
      
      <Route
        path="/driver/trip/:id"
        element={
          <PrivateRoute role="CONDUCTOR">
            <MainLayout>
              <DriverTripCompletedDetails />
            </MainLayout>
          </PrivateRoute>
        }
      /> 


    </Routes>
  );
}