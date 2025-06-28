// src/pages/driver/RequestDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import "./styles/RequestDetailsPage.css";

export default function RequestDetailsPage() {
  const { viajeId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const userId = localStorage.getItem("userId");
      const res = await axiosInstance.get(`/usuario/profile/DriverId/${userId}`);
      const driverId = res.data;

      await axiosInstance.put(`/trips/${viajeId}/aceptar/${driverId}`);
      alert("¡Viaje aceptado exitosamente!");
      navigate("/driver/view-requests");
    } catch (error) {
      console.error("Error al aceptar el viaje:", error);
      alert("No se pudo aceptar el viaje. Intenta nuevamente.");
    }
  };

  if (loading) return <div className="page-container">Cargando...</div>;

  return (
    <div className="page-container">

      <div className="trip-details-card">
        <h2>Detalles Del Viaje</h2>

        <p><strong>Viaje ID:</strong> #{trip.id}</p>
        <p><strong>Estado:</strong> {trip.estado}</p>
        <p><strong>Fecha de partida:</strong> {trip.fechaHoraPartida}</p>
        <p><strong>Origen:</strong> {trip.provinciaOrigen} ({trip.direccionOrigen})</p>
        <p><strong>Destino:</strong> {trip.provinciaDestino} ({trip.direccionDestino})</p>
        <p><strong>Asientos reservados:</strong> {trip.asientosReservados}</p>
        <p><strong>Costo:</strong> S/. {trip.costo.toFixed(2)}</p>

        <button className="accept-button" onClick={handleAccept}>
          Aceptar Viaje
        </button>
      </div>
    </div>
  );
}