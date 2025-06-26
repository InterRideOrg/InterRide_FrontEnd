// src/pages/passenger/RateTripPage.jsx
import React, { useState } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import "./styles/RateTripPage.css";

export default function RateTripPage() {
  const [comentario, setComentario] = useState("");
  const [viajeId, setViajeId] = useState("");
  const [conductorId, setConductorId] = useState("");
  const [pasajeroId, setPasajeroId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      await axiosInstance.post("/calificaciones", {
        comentario,
        viajeId: parseInt(viajeId),
        conductorId: parseInt(conductorId),
        pasajeroId: parseInt(pasajeroId),
      });

      setSuccessMessage("¡Viaje calificado exitosamente!");
      setComentario("");
      setViajeId("");
      setConductorId("");
      setPasajeroId("");
    } catch (error) {
      console.error("Error al calificar el viaje:", error);
      alert("Ocurrió un error al enviar la calificación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rate-trip-container">
      <h1 className="rate-trip-title">Califica tu viaje</h1>
      <form onSubmit={handleSubmit} className="rate-trip-form">
        <input
          type="text"
          placeholder="ID del viaje"
          value={viajeId}
          onChange={(e) => setViajeId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ID del conductor"
          value={conductorId}
          onChange={(e) => setConductorId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ID del pasajero"
          value={pasajeroId}
          onChange={(e) => setPasajeroId(e.target.value)}
          required
        />
        <textarea
          placeholder="Comentario (máx. 255 caracteres)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={255}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar calificación"}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}
