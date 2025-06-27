import React from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import MainLayout from "../../components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDriverHome,
  fetchDriverProfile,
} from "../../services/mockApi";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function TripCard({ title, subtitle, onClick, color = "primary.main", actionLabel = "Ver Más", sx = {} }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: color,
        color: "common.white",
        px: 3,
        py: 2,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        ...sx,
      }}
    >
      <Box>
        <Typography fontWeight={600}>{title}</Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {actionLabel}
        </Typography>
        <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}

function CompletedTripCard({ date, time, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: "#b0bec5",
        color: "white",
        px: 3,
        py: 2,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        minHeight: 60,
      }}
    >
      <Box>
        <Typography fontWeight={500} sx={{ opacity: 0.9 }}>
          Fecha: {date}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Hora: {time}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Detalle
      </Typography>
    </Box>
  );
}

export default function DriverHomePage() {
  const { user } = useAuth();

  // Home (viajes)
  const { data: home, isLoading: loadingHome } = useQuery({
    queryKey: ["home"],
    queryFn: fetchDriverHome,
  });

  // Perfil (nombre)
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchDriverProfile,
  });

  if (loadingHome || loadingProfile) {
    return (
      <MainLayout>
        <Box mt={12} textAlign="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const { InProgress, Requests, Completed } = home;

  return (
      <Stack spacing={4} maxWidth="1000px" mx="auto">
        {/* Encabezado */}
        <Box mt={2} mb={2}>
          <Typography variant="h4" fontWeight={700}>
            Hola, {profile?.Driver?.nombreCompleto ?? "Usuario"}
          </Typography>
          <Typography color="text.secondary" fontSize={15} mt={1}>
            Es hora de un nuevo viaje.
          </Typography>
        </Box>

        {/* Viaje en curso */}
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FiberManualRecordIcon sx={{ color: "error.main", fontSize: 16 }} />
            <Typography fontWeight={700}>Viaje En Curso</Typography>
          </Stack>
          {InProgress ? (
            <TripCard
              title={InProgress.destination}
              subtitle={`Conductor: ${InProgress.driver}`}
              color="#43b6bb"
              onClick={() => alert("Detalle del viaje en curso")}
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 3, opacity: 0.6 }}>
              No tienes viajes activos.
            </Typography>
          )}
        </Stack>

        {/* Solicitudes de viajes */}
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <CheckCircleIcon sx={{ color: "success.main", fontSize: 18, mr: 1 }} />
              <Typography fontWeight={700}>Solicitudes de Viajes</Typography>
            </Box>
            <IconButton size="small" onClick={() => alert("Ver todos")}>
              <Typography variant="body2" sx={{ textDecoration: "underline" }}>
                Ver Todos
              </Typography>
            </IconButton>
          </Stack>
          <Stack spacing={2}>
            {Requests.map((v) => (
              <TripCard
                key={v.id}
                title={v.destination}
                subtitle={`${v.seats} Disponibles`}
                onClick={() => alert(`Ver viaje ${v.id}`)}
                color="#456977"
              />
            ))}
          </Stack>
        </Stack>

        {/* Viajes completados */}
        <Stack spacing={1.5} mt={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography fontWeight={700} fontSize={20}>
              Viajes Completados
            </Typography>

            <IconButton size="small" onClick={() => alert("Ver todos completados")}>
              <Typography variant="body2" sx={{ textDecoration: "underline" }}>
                Ver Todos
              </Typography>
            </IconButton>
          </Box>
          <Stack spacing={2}>
            {Completed.map((v) => (
              <CompletedTripCard
                key={v.id}
                date={new Date(v.date).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                time={"15:26"}
                onClick={() => navigate(`/driver/trip/${v.id}`)}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
  );
}