import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIosIcon   from "@mui/icons-material/ArrowForwardIos";

import MainLayout        from "../../components/layout/MainLayout";
import LargeActionButton from "../../components/ui/LargeActionButton";
import { useQuery }      from "@tanstack/react-query";
import { fetchPassengerHome } from "../../services/mockApi";
import { useAuth } from "../../auth/AuthContext";

/* ----- tarjeta de viaje (reutilizable) ------------------- */
function TripCard({ title, subtitle, onClick, color = "primary.main" }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: color,
        color: "common.white",
        px: 2.5,
        py: 1.5,
        borderRadius: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
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
      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
    </Box>
  );
}

/* -------------------------------------------------------- */
export default function PassengerHomePage() {
  const { user } = useAuth(); // nombre para “Hola, Madison”
  const { data, isLoading }   = useQuery({
    queryKey: ["home"],
    queryFn : fetchPassengerHome
  });

  if (isLoading) {
    return (
      <MainLayout>
        <Box mt={12} textAlign="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const { current, available } = data;

  return (
    <MainLayout>
      <Stack spacing={4} maxWidth="900px" mx="auto">
      {/* ---------- Encabezado + acción ---------- */}
        <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"        // ← mantiene responsividad en pantallas chicas
        gap={2}                // separación cuando haga wrap
        mb={4}
        >
            {/* saludo */}
            <Box>
                <Typography variant="h4" fontWeight={600}>
                Hola, {user?.firstName ?? "usuario"}
                </Typography>
                <Typography color="text.secondary">
                Es hora de un nuevo viaje.
                </Typography>
            </Box>
                {/* botón de acción */}
                <LargeActionButton
                sx={{ flexShrink: 0 }}
                onClick={() => alert("🚧 Próximamente")}
                >
                Solicitar Un Nuevo Viaje
                </LargeActionButton>
        </Box>

        {/* bloque Viaje en curso */}
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FiberManualRecordIcon sx={{ color: "error.main", fontSize: 12 }} />
            <Typography fontWeight={700}>Viaje En Curso</Typography>
          </Stack>

          {current ? (
            <TripCard
              title={current.destination}
              subtitle={`Conductor: ${current.driver}`}
              color="secondary.main"
            />
          ) : (
            <Typography variant="body2" sx={{ ml: 3, opacity: 0.6 }}>
              No tienes viajes activos.
            </Typography>
          )}
        </Stack>

        {/* bloque Viajes disponibles */}
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon
                sx={{ color: "success.main", fontSize: 12, mr: 1 }}
              />
              <Typography fontWeight={700}>Viajes Disponibles</Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => alert("ver todos")}
              sx={{ fontSize: 13 }}
            >
              Ver Todos
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            {available.map(v => (
              <TripCard
                key={v.id}
                title={v.destination}
                subtitle={`${v.seats} asientos disponibles`}
                onClick={() => alert(`Ver viaje ${v.id}`)}
                color="primary.dark"
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </MainLayout>
  );
}
