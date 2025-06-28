// src/pages/driver/DriverHomePage.jsx
import React, { useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import FiberManualRecordIcon  from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIosIcon    from "@mui/icons-material/ArrowForwardIos";

import MainLayout         from "../../components/layout/MainLayout";
import { useAuth }        from "../../auth/AuthContext";
import axiosInstance      from "../../interceptors/axiosInstance";
import { useNavigate }    from "react-router-dom";
import {
  useQuery,
  useIsFetching,
} from "@tanstack/react-query";

import "./styles/DriverHomePage.css";

/* ───────────────────────── Tarjeta reutilizable ─────────────────────── */
function TripCard({ title, subtitle, onClick, color = "var(--clr-primary)" }) {
  return (
    <Box className="dh-card" style={{ backgroundColor: color }} onClick={onClick}>
      <Box>
        <Typography fontWeight={600}>{title}</Typography>
        {subtitle && <Typography variant="caption">{subtitle}</Typography>}
      </Box>
      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
    </Box>
  );
}

/* ───────────────────────── Página ───────────────────────────────────── */
export default function DriverHomePage() {
  const { user }   = useAuth();          // contiene userId
  const navigate   = useNavigate();
  const isLoading  = useIsFetching() > 0;

  /* 1️⃣  id del conductor */
  const { data: driverId } = useQuery({
    enabled : !!user?.userId,
    queryKey: ["driverId", user?.userId],
    queryFn : () =>
      axiosInstance
        .get(`/usuario/profile/DriverId/${user.userId}`)
        .then(r => r.data),
    staleTime: 5 * 60_000,
  });

  /* 2️⃣  Perfil público (para saludo) */
  const { data: profile } = useQuery({
    enabled : !!driverId,
    queryKey: ["driverProfile", driverId],
    queryFn : () =>
      axiosInstance
        .get(`/usuario/profile/conductor/${driverId}`)
        .then(r => r.data),
    staleTime: 5 * 60_000,
  });

  /* 3️⃣  Viaje en curso (si existe) */
  const { data: currentTrip } = useQuery({
    enabled : !!driverId,
    queryKey: ["driverCurrentTrip", driverId],
    queryFn : () =>
      axiosInstance
        .get(`/trips/${driverId}/current`)
        .then(r => r.data)
        .catch(err => {
          if (err.response?.status === 404) return null; // sin viaje activo
          throw err;
        }),
    retry    : false,
    staleTime: 15_000,
  });

  /* 4️⃣  Solicitudes de viajes (pendientes de aceptación) */
  const { data: requestedTrips = [] } = useQuery({
    queryKey : ["viajesSolicitados"],
    queryFn  : () =>
      axiosInstance.get("/trips/viajesSolicitados").then(r => r.data),
    staleTime: 30_000,
  });

  /* 5️⃣ Viajes completados */
  const { data: finishedTrips = [] } = useQuery({
    enabled  : !!driverId,
    queryKey : ["viajesCompletados", driverId],
    queryFn  : () =>
      axiosInstance
        .get(`/trips/viajesCompletados/${driverId}`)
        .then(r => r.data)
        .catch(err => {
          if (err.response?.status === 404) return [];
          throw err;
        }),
    staleTime: 30_000,
  });

  /* ───────────── nombre para el saludo ───────────── */
  const nombre = useMemo(
    () =>
      // el backend podría devolver `nombre`  o  `nombres`
      profile?.nombre       // ej. { nombre: "Madison" }
      ?? profile?.nombres   // ej. { nombres: "Madison" }
      ?? "Conductor",
    [profile]
  );

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <MainLayout>
      {isLoading ? (
        <Box mt={12} textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={4} maxWidth="900px" mx="auto">
          {/* Encabezado */}
          <Box className="dh-header">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Hola,&nbsp;{nombre}
              </Typography>
              <Typography color="text.secondary">
                ¡Listo para un nuevo viaje!
              </Typography>
            </Box>
          </Box>

          {/* Viaje en curso */}
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FiberManualRecordIcon sx={{ fontSize: 12, color: "var(--clr-error)" }} />
              <Typography fontWeight={700}>Viaje en curso</Typography>
            </Stack>

            {currentTrip ? (
              <TripCard
                title={currentTrip.destinoProvincia}
                subtitle={`Pasajeros abordo: ${currentTrip.asientosOcupados}/${currentTrip.cantidadAsientos}`}
                color="var(--clr-secondary)"
                onClick={() =>
                  navigate(`/driver/current-trip/${driverId}/${currentTrip.id}`)
                }
              />
            ) : (
              <Typography className="dh-muted">No tienes viajes activos</Typography>
            )}
          </Stack>

          {/* Solicitudes de viajes */}
          <Stack spacing={1.5}>
            <Box className="dh-section-bar">
              <Box className="dh-section-title">
                <FiberManualRecordIcon
                  sx={{ fontSize: 12, color: "var(--clr-success)", mr: 1 }}
                />
                <Typography fontWeight={700}>Solicitudes de viajes</Typography>
              </Box>

              <Typography
                variant="body2"
                className="dh-link"
                onClick={() => navigate("/driver/requests")}
              >
                Ver todos
              </Typography>
            </Box>

            {requestedTrips.length ? (
              <Stack spacing={2}>
                {requestedTrips.map(v => (
                  <TripCard
                    key={v.id}
                    title={v.provinciaDestino}
                    subtitle={`${v.asientosReservados} asientos reservados`}
                    onClick={() => navigate(`/driver/requests/${v.id}`)}
                  />
                ))}
              </Stack>
            ) : (
              <Typography className="dh-muted">
                No hay solicitudes en este momento
              </Typography>
            )}
          </Stack>

          {/* Viajes completados */}
          <Stack spacing={1.5}>
            <Box className="dh-section-bar">
              <Typography fontWeight={700}>Viajes completados</Typography>

              <Typography
                variant="body2"
                className="dh-link"
                onClick={() => navigate(`/driver/history/${driverId}`)}
              >
                Ver todos
              </Typography>
            </Box>

            {finishedTrips.length ? (
              <Stack spacing={2}>
                {finishedTrips.map(v => (
                  <TripCard
                    key={v.id}
                    title={new Date(v.fechaHoraPartida).toLocaleDateString()}
                    subtitle={`${v.provinciaOrigen} → ${v.provinciaDestino}`}
                    color="var(--clr-gray)"
                    onClick={() => navigate(`/driver/history/${driverId}`)}
                  />
                ))}
              </Stack>
            ) : (
              <Typography className="dh-muted">
                Aún no has completado viajes
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
    </MainLayout>
  );
}
