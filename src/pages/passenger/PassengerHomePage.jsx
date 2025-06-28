// src/pages/passenger/PassengerHomePage.jsx
import React, { useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIosIcon   from "@mui/icons-material/ArrowForwardIos";

import MainLayout        from "../../components/layout/MainLayout";
import LargeActionButton from "../../components/ui/LargeActionButton";

import { useQuery, useIsFetching } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth }  from "../../auth/AuthContext";
import axiosInstance from "../../interceptors/axiosInstance";

import "./styles/PassengerHomePage.css";

/* ───────────────────────── Tarjeta reutilizable ─────────────────────── */
function TripCard({ title, subtitle, onClick, color = "var(--clr-primary)" }) {
  return (
    <Box className="ph-card" style={{ backgroundColor: color }} onClick={onClick}>
      <Box>
        <Typography fontWeight={600}>{title}</Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
    </Box>
  );
}

/* ───────────────────────── Página principal ─────────────────────────── */
export default function PassengerHomePage() {
  const { user } = useAuth();          // contiene userId
  const navigate = useNavigate();

  /* 1️⃣ PasajeroId (tabla pasajero) */
  const { data: passengerId } = useQuery({
    enabled : !!user?.userId,
    queryKey: ["passengerId", user?.userId],
    queryFn : () =>
      axiosInstance
        .get(`/usuario/profile/PassengerId/${user.userId}`)
        .then(r => r.data),
    staleTime: 5 * 60_000,
  });

  /* 2️⃣ Perfil para saludo */
  const { data: profile } = useQuery({
    enabled : !!passengerId,
    queryKey: ["passengerProfile", passengerId],
    queryFn : () =>
      axiosInstance.get(`/pasajero/${passengerId}`).then(r => r.data),
    staleTime: 5 * 60_000,
  });

  /* 3️⃣ Viajes disponibles */
  const { data: disponibles = [] } = useQuery({
    queryKey : ["viajesDisponibles"],
    queryFn  : () =>
      axiosInstance.get("/trips/viajesDisponibles").then(r => r.data),
    staleTime: 30_000,
  });

/* 4️⃣ Viaje en curso  –– usa ahora /trips/{id_pasajero}/current
   ────────────────────────────────────────────────────────── */
   const { data: viajeActual } = useQuery({
    enabled : !!passengerId,
    queryKey: ["viajeEnCurso", passengerId],
    queryFn : () =>
      axiosInstance
        .get(`/trips/${passengerId}/current`)
        .then(r => r.data)                 // ← devuelve el objeto ViajeEnCursoResponse
        .catch(err => {
          // El backend responde 404 cuando NO hay viaje en curso
          if (err.response?.status === 404) return null;
          throw err;                       // otras fallas sí se propagan
        }),
    retry    : false,
    staleTime: 15_000,
  });
  

  const isFetching = useIsFetching() > 0;
  const nombre     = useMemo(() => profile?.nombres ?? "Pasajero", [profile]);

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <MainLayout>
      {isFetching ? (
        <Box mt={12} textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={4} maxWidth="900px" mx="auto">
          {/* ENCABEZADO */}
          <Box className="ph-header">
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Hola,&nbsp;{nombre}
              </Typography>
              <Typography color="text.secondary">
                Es hora de un nuevo viaje
              </Typography>
            </Box>

            <LargeActionButton onClick={() => navigate("/request-trip")}>
              Solicitar un nuevo viaje
            </LargeActionButton>
          </Box>

          {/* VIAJE EN CURSO */}
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FiberManualRecordIcon sx={{ fontSize: 12, color: "var(--clr-error)" }} />
              <Typography fontWeight={700}>Viaje en curso</Typography>
            </Stack>

            {viajeActual ? (
              <TripCard
                title={viajeActual.destinoProvincia}
                subtitle={`Conductor: ${viajeActual.nombreConductor}`}
                color="var(--clr-secondary)"
                onClick={() =>
                  navigate(`/passenger/current-trip/${passengerId}/${viajeActual.id}`)
                }
              />
            ) : (
              <Typography className="ph-muted">No tienes viajes activos</Typography>
            )}
          </Stack>

          {/* VIAJES DISPONIBLES */}
          <Stack spacing={1.5}>
            <Box className="ph-section-bar">
              <Box className="ph-section-title">
                <FiberManualRecordIcon
                  sx={{ fontSize: 12, color: "var(--clr-success)", mr: 1 }}
                />
                <Typography fontWeight={700}>Viajes disponibles</Typography>
              </Box>

              <Typography
                variant="body2"
                className="ph-link"
                onClick={() => navigate("/passenger/available-trips")}
              >
                Ver todos
              </Typography>
            </Box>

            {disponibles.length ? (
              <Stack spacing={2}>
                {disponibles.map(v => (
                  <TripCard
                    key={v.viajeId}
                    title={v.provinciaDestino}
                    subtitle={`${v.asientosDisponibles} asientos disponibles`}
                    onClick={() => navigate(`/trip/${v.viajeId}`)}
                  />
                ))}
              </Stack>
            ) : (
              <Typography className="ph-muted">
                No hay viajes disponibles por ahora
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
    </MainLayout>
  );
}
