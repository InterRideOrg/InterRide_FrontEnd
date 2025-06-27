// src/pages/passenger/RateTripPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import "./styles/RateTripPage.css";

export default function RateTripPage() {
  const { pasajeroId, viajeId, conductorId } = useParams();

  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [success, setSuccess] = useState(false);
  const [boletoData, setBoletoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoleto = async () => {
      try {
        const res = await axiosInstance.get(`/boletos/${pasajeroId}/${viajeId}`);
        setBoletoData(res.data);
      } catch (err) {
        console.error("Error fetching boleto info", err);
        alert("No se pudo cargar la información del viaje.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoleto();
  }, [pasajeroId, viajeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/calificaciones", {
        estrellas: rating,
        comentario,
        viajeId: parseInt(viajeId),
        conductorId: parseInt(conductorId),
        pasajeroId: parseInt(pasajeroId),
      });
      setSuccess(true);
      setComentario("");
      setRating(0);
    } catch (err) {
      console.error("Error submitting rating", err);
      alert("Error al enviar la calificación.");
    }
  };

  if (loading) return <div className="rate-trip-page"><p>Cargando información del viaje...</p></div>;
  if (!boletoData) return <div className="rate-trip-page"><p>No se encontró información del viaje.</p></div>;

  return (
    <>
      <MainNavbar />
      <div className="rate-trip-page">
        <h1>Califica Tu Viaje</h1>
        <div className="RateTrip-trip-card">
          <div className="RateTrip-trip-header">
            <h2>{boletoData.provinciaDestino}</h2>
            <span>Información Del Viaje</span>
          </div>

          <div className="RateTrip-trip-info">
            <div>
              <strong>CONDUCTOR</strong>
              <p>Jose Perez</p> {/* Replace with dynamic conductor name if available */}
            </div>
            <div className="RateTrip-price">
              <strong>PRECIO</strong>
              <p>{boletoData.costo?.toFixed(2)} PEN</p>
            </div>
          </div>

          <div className="RateTrip-trip-details">
            <strong>Trayecto</strong>
            <p>Salida: {boletoData.fechaHoraPartida}</p>
            <p>Llegada: {boletoData.fechaHoraLlegada}</p>
          </div>

          <form onSubmit={handleSubmit} className="RateTrip-rating-form">
            <label>CALIFICA TU VIAJE</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  size={30}
                  color={(hovered || rating) >= value ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(value)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe un comentario..."
              maxLength={255}
              required
            />

            <button type="submit">Confirmar</button>
            {success && (
              <p className="RateTrip-success-message">¡Calificación enviada exitosamente!</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
