// src/pages/passenger/PassengerProfilePage.jsx
import React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useQuery } from "@tanstack/react-query";
import { fetchPassengerProfile } from "../../services/mockApi";
import RoundedTextField from "../../components/ui/RoundedTextField";
import MainLayout from "../../components/layout/MainLayout";

export default function PassengerProfilePage() {
  /* ------------------------------------------------------------------ */
  /*   DATA                                                             */
  /* ------------------------------------------------------------------ */
  const { data, isLoading } = useQuery({
    queryKey: ["passenger", "profile"],
    queryFn: fetchPassengerProfile,
  });

  if (isLoading || !data) {
    return (
      <MainLayout>
        <Box py={10} textAlign="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const fullName = `${data.nombres} ${data.apellidos}`;

  /* ------------------------------------------------------------------ */
  /*   UI                                                               */
  /* ------------------------------------------------------------------ */
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
            <FieldLine label="EMAIL" value={data.correo} />
            <FieldLine label="TELÉFONO" value={data.telefono} />
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
