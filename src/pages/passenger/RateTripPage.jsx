// src/pages/passenger/RateTripPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import "./styles/RateTripPage.css";

export default function RateTripPage() {
  const { pasajeroId, viajeId, conductorId } = useParams();
  const navigate = useNavigate();

  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [success, setSuccess] = useState(false);
  const [boletoData, setBoletoData] = useState(null);
  const [conductorName, setConductorName] = useState("");
  const [loading, setLoading] = useState(true);

  // Load trip and conductor info
  useEffect(() => {
    const fetchTripAndConductor = async () => {
      try {
        const [boletoRes, conductorRes] = await Promise.all([
          axiosInstance.get(`/boletos/${pasajeroId}/${viajeId}`),
          axiosInstance.get(`/perfil-publico/${viajeId}`)
        ]);
        setBoletoData(boletoRes.data);
        const { nombres, apellidos } = conductorRes.data;
        setConductorName(`${nombres} ${apellidos}`);
      } catch (err) {
        console.error("Error fetching trip or conductor data", err);
        alert("No se pudo cargar la información del viaje o del conductor.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndConductor();
  }, [pasajeroId, viajeId]);

  // Submit rating
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
/*
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/passenger/home/${pasajeroId}`);
      }, 1500);*/
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

          <div className="trip-info">
            <div>
              <strong>CONDUCTOR</strong>
              <p>{conductorName}</p>
            </div>
            <div className="price">
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
