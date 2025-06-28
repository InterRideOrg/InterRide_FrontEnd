import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, Rating, CircularProgress } from "@mui/material";
import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import { useParams } from "react-router-dom";

const labelStyle = { fontWeight: 700, color: "white", mb: 0.5, fontSize: 15 };
const valueStyle = { color: "white", mb: 1, fontSize: 15 };

export default function DriverTripCompletedDetails() {
  const { id } = useParams(); // id del viaje
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia la ruta según tu backend
    axiosInstance
      .get(`/viajes/${id}`)
      .then((res) => {
        setTrip(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <MainNavbar />
        <Box mt={12} textAlign="center">
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <MainNavbar />
        <Box mt={12} textAlign="center">
          <Typography>No se encontró información del viaje.</Typography>
        </Box>
      </>
    );
  }

  // Ejemplo de estructura esperada de trip:
  // {
  //   destino: "Caral",
  //   origen: "Lima",
  //   fecha: "2025-03-26",
  //   hora: "15:26",
  //   pasajero: "Juanito",
  //   calificacion: 4,
  //   asientos: 4,
  //   monto: 28.5,
  //   moneda: "PEN"
  // }

  return (
    <>
      <MainNavbar />
      <Box sx={{ bgcolor: "#e3f2fd", minHeight: "100vh", px: 0, py: 4 }}>
        <Box px={{ xs: 2, md: 8 }}>
          <Typography variant="h5" fontWeight={700} mt={2} mb={2}>
            Viajes Completados
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              {trip.destino || "Destino"}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              Información Del Viaje
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#456977",
              borderRadius: 3,
              p: 4,
              maxWidth: 440,
              minWidth: 320,
              color: "white",
              mb: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography sx={labelStyle}>PASAJERO</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography sx={labelStyle}>Calificación</Typography>
                <Rating
                  value={trip.calificacion || 0}
                  precision={0.5}
                  readOnly
                  sx={{ color: "#00bcd4" }}
                />
              </Box>
            </Stack>
            <Typography sx={valueStyle}>{trip.pasajero || "-"}</Typography>

            <Typography sx={labelStyle}>FECHA Y HORA</Typography>
            <Typography sx={valueStyle}>
              {trip.fecha || "-"} - {trip.hora || "-"}
            </Typography>

            <Stack direction="row" gap={4} mt={2}>
              <Box>
                <Typography sx={labelStyle}>ORIGEN</Typography>
                <Typography sx={valueStyle}>{trip.origen || "-"}</Typography>
              </Box>
              <Box>
                <Typography sx={labelStyle}>Destino</Typography>
                <Typography sx={valueStyle}>{trip.destino || "-"}</Typography>
              </Box>
            </Stack>

            <Typography sx={labelStyle} mt={2}>
              ASIENTOS UTILIZADOS POR EL PASAJERO
            </Typography>
            <Typography sx={valueStyle}>{trip.asientos || "-"}</Typography>

            <Typography sx={labelStyle} mt={2}>
              MONTO
            </Typography>
            <Typography sx={valueStyle}>
              {trip.monto ? `${trip.monto.toFixed(2)} ${trip.moneda || "PEN"}` : "-"}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
}