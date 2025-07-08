// src/pages/driver/RequestDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import "./styles/RequestDetailsPage.css";
import dayjs from "dayjs";
import 'dayjs/locale/es';

dayjs.locale('es');

export default function RequestDetailsPage() {
  const { viajeId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axiosInstance.get(`/trips/viajeSolicitado/${viajeId}`);
        setTrip(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trip details", err);
      }
    };

    fetchTrip();
  }, [viajeId]);

  const handleAccept = async () => {
    setAccepting(true);
    
    try {
      const userId = localStorage.getItem("userId");
      const res = await axiosInstance.get(`/usuario/profile/DriverId/${userId}`);
      const driverId = res.data;

      if (!driverId) {
        setAccepting(false);
        return alert("No se encontró al conductor.");
      }

      await axiosInstance.put(`/trips/${viajeId}/aceptar/${driverId}`);
      
      alert("¡Viaje aceptado exitosamente!");
      navigate(`/driver/home/${driverId}`);
    } catch (error) {
      console.error("Error al aceptar el viaje:", error);
      setAccepting(false);
      alert("No se pudo aceptar el viaje. Intenta nuevamente.");
    }
  };

  // ...existing code...

  if (loading) return <div className="page-container">Cargando...</div>;

  return (
    <div className="page-container">
      <div className="trip-details-card">
        <h2>Detalles Del Viaje</h2>

        <p><strong>Estado:</strong> {trip.estado}</p>
        <p><strong>Fecha de partida:</strong> {dayjs(trip.fechaHoraPartida).format("DD [de] MMMM [de] YYYY [a las] HH:mm")}</p>
        <p><strong>Origen:</strong> {trip.provinciaOrigen} ({trip.direccionOrigen})</p>
        <p><strong>Destino:</strong> {trip.provinciaDestino} ({trip.direccionDestino})</p>
        <p><strong>Asientos reservados:</strong> {trip.asientosReservados}</p>
        <p><strong>Costo:</strong> S/. {trip.costo.toFixed(2)}</p>

        {/* ...existing code... */}
        <button 
          className={`accept-button ${accepting ? 'accepting' : ''}`}
          onClick={handleAccept}
          disabled={accepting}
        >
          {accepting ? (
            <>
              <span className="spinner"></span>
              Procesando viaje...
            </>
          ) : (
            'Aceptar Viaje'
          )}
        </button>

        {accepting && (
          <div className="accepting-message">
            <p>Aceptando viaje y notificando al pasajero...</p>
            <p>Por favor, espera un momento...</p>
          </div>
        )}
      </div>
    </div>
  );
}