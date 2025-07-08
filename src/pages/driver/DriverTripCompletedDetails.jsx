import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, Rating, CircularProgress, Chip, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

dayjs.locale('es');

const labelStyle = { fontWeight: 700, color: "white", mb: 0.5, fontSize: 15 };
const valueStyle = { color: "white", mb: 1, fontSize: 15 };

export default function DriverTripCompletedDetails() {
  const { driverId, id } = useParams();
  console.log("Driver ID:", driverId);
  console.log("Trip ID:", id);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/trips/viajeCompletado/detalle/${id}`)
      .then((res) => {
        setTrip(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching trip details:', error);
        setLoading(false);
      });
  }, [id]);

  const handleGoBack = () => {
    navigate(`/driver/history/${driverId}`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <CircularProgress size={60} sx={{ color: "#456977" }} />
          <Typography mt={2} color="#456977">Cargando detalles del viaje...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" color="error">No se encontró información del viaje.</Typography>
        </Paper>
      </Box>
    );
  }

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "-", time: "-" };
    const date = dayjs(dateTime);
    return {
      date: date.format("DD [de] MMMM [de] YYYY"),
      time: date.format("HH:mm")
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTime(trip.fechaHora);

  return (
    <Box sx={{ py: 4 }}>
      <Box px={{ xs: 2, md: 8 }} maxWidth="800px" mx="auto">


        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} color="#456977" gutterBottom>
            Viaje Completado
          </Typography>
          <Chip 
            label={`Destino: ${trip.provinciaDestino || "No especificado"}`}
            color="success" 
            size="large"
            sx={{ fontWeight: 600, fontSize: 16 }}
          />
        </Box>

        {/* Contenido Principal */}
        <Paper
          elevation={2}
          sx={{
            bgcolor: "#456977",
            borderRadius: 4,
            p: 4,
            color: "white",
            mb: 3,
          }}
        >
          {/* Fecha y Hora */}
          <Box mb={3}>
            <Typography sx={labelStyle}>📅 FECHA Y HORA</Typography>
            <Typography sx={{ ...valueStyle, fontSize: 18 }}>
              {formattedDate} a las {formattedTime}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

          {/* Ubicaciones */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} mb={3}>
            <Box flex={1}>
              <Typography sx={labelStyle}>📍 ORIGEN</Typography>
              <Typography sx={valueStyle}>
                {trip.direccionOrigen || "-"}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography sx={labelStyle}>🎯 DESTINO</Typography>
              <Typography sx={valueStyle}>
                {trip.provinciaDestino || "-"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

          {/* Pasajeros */}
          <Box mb={3}>
            <Typography sx={labelStyle}>
              👥 PASAJEROS ({trip.nombresPasajeros?.length || 0})
            </Typography>
            {trip.nombresPasajeros && trip.nombresPasajeros.length > 0 ? (
              <Box>
                {trip.nombresPasajeros.map((pasajero, index) => (
                  <Typography key={index} sx={valueStyle}>
                    • {pasajero}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography sx={valueStyle}>No hay pasajeros registrados</Typography>
            )}
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

          {/* Detalles del viaje */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} mb={3}>
            <Box flex={1}>
              <Typography sx={labelStyle}>💺 ASIENTOS UTILIZADOS</Typography>
              <Typography sx={{ ...valueStyle, fontSize: 18 }}>
                {trip.asientosUtilizados || 0} asiento{trip.asientosUtilizados !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography sx={labelStyle}>💰 MONTO GANADO</Typography>
              <Typography sx={{ ...valueStyle, fontSize: 24, fontWeight: 700, color: "#4caf50" }}>
                S/. {trip.costoTotal ? trip.costoTotal.toFixed(2) : "0.00"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

          {/* Calificación */}
          <Box textAlign="center">
            <Typography sx={labelStyle}>⭐ CALIFICACIÓN DEL VIAJE</Typography>
            <Rating
              value={trip.calificacionPromedio || 0}
              precision={0.5}
              readOnly
              size="large"
              sx={{ color: "#ffc107", my: 1 }}
            />
            <Typography sx={{ ...valueStyle, fontSize: 18 }}>
              {trip.calificacionPromedio ? `${trip.calificacionPromedio.toFixed(1)} / 5.0` : "Sin calificar"}
            </Typography>
          </Box>
        </Paper>

        {/* Resumen */}
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: "#e8f5e8",
            border: "2px solid #4caf50"
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#2e7d32" mb={1}>
            📊 Resumen del Viaje
          </Typography>
          <Typography variant="body1" color="#2e7d32">
            ¡Felicitaciones! Completaste exitosamente un viaje transportando{" "}
            <strong>{trip.asientosUtilizados || 0}</strong> pasajero
            {trip.asientosUtilizados !== 1 ? 's' : ''} y generaste un ingreso total de{" "}
            <strong>S/. {trip.costoTotal ? trip.costoTotal.toFixed(2) : "0.00"}</strong>.
          </Typography>
        </Paper>

        {/* Botón de volver al final también */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              bgcolor: "#456977",
              "&:hover": {
                bgcolor: "#32586B",
              },
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            Volver al Historial de Viajes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}