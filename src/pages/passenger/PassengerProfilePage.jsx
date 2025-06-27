import React, { use } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axiosInstance from "../../interceptors/axiosInstance";
import RoundedTextField from "../../components/ui/RoundedTextField";
import MainLayout from "../../components/layout/MainLayout";
import { useState, useEffect } from "react";

/* ────────────── Hook para obtener el id del usuario desde localStorage ────────────── */
function useUserId() {
  return localStorage.getItem("userId");
}

/* ────────────── Fetcher para el perfil privado ────────────── */

export default function PassengerProfilePage() {

  const[passengerId, setPassengerId] = useState(null);
  const[passengerProfile, setPassengerProfile] = useState(null);

  const userId = useUserId();

  useEffect(() => {
    
      axiosInstance.get(`/usuario/profile/PassengerId/${userId}`)
      .then(response => {
          setPassengerId(response.data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }, [userId]);


  useEffect(() => {
  
    if (!passengerId) return; // Evita hacer la solicitud si passengerId aún no está disponible
      axiosInstance.get(`/pasajero/priv/${passengerId}`)
      .then(response => {
          setPassengerProfile(response.data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }, [passengerId]);


  if (!passengerProfile) {
    return (
      <MainLayout>
        <Box py={10} textAlign="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const fullName = `${passengerProfile.nombres} ${passengerProfile.apellidos}`;

  return (
    <MainLayout>
      {/* ─────────────────────────  encabezado  ─────────────────────── */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Mi&nbsp;Perfil
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={() => alert("👋 Cerrando sesión…")}
        >
          Cerrar&nbsp;sesión
        </Button>
      </Box>

      {/* ──────────────────────────── cuerpo ────────────────────────── */}
      <Box
        mt={4}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        gap={6}
      >
        {/* avatar */}
        <Avatar
          sx={{
            width: { xs: 140, md: 200 },
            height: { xs: 140, md: 200 },
            bgcolor: "grey.900",
          }}
        />

        {/* card con datos */}
        <Box
          flexGrow={1}
          sx={{
            bgcolor: "secondary.main", // teal
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 6 },
            borderRadius: 2,
            minWidth: { md: 520 },
          }}
        >
          <Stack spacing={4}>
            <FieldLine label="NOMBRES" value={fullName} />
            <FieldLine label="EMAIL" value={passengerProfile.correo} />
            <FieldLine label="TELÉFONO" value={passengerProfile.telefono} />
            <FieldLineNoIcon label="USERNAME" value={passengerProfile.username} />
          </Stack>
        </Box>
      </Box>
    </MainLayout>
  );
}

/* ───────────────────────── componente campo ───────────────────────── */
function FieldLine({ label, value }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.5, fontWeight: 600, color: "common.black" }}
      >
        {label}
      </Typography>

      <RoundedTextField
        fullWidth
        size="small"
        value={value}
        disabled /* ← fuerza modo lectura + color gris */
        InputProps={{
          endAdornment: (
            <EditRoundedIcon
              fontSize="small"
              sx={{ color: "grey.600", opacity: 0.7 }}
            />
          ),
        }}
      />
    </Box>
  );
}

/* ────────────── Campo sin ícono de lápiz ────────────── */
function FieldLineNoIcon({ label, value }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.5, fontWeight: 600, color: "common.black" }}
      >
        {label}
      </Typography>
      <RoundedTextField
        fullWidth
        size="small"
        value={value}
        disabled
      />
    </Box>
  );
}