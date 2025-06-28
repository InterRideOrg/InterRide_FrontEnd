import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axiosInstance from "../../interceptors/axiosInstance";
import RoundedTextField from "../../components/ui/RoundedTextField";
import MainLayout from "../../components/layout/MainLayout";

/* ────────────── Hook para obtener el id del usuario desde localStorage ────────────── */
function useUserId() {
  return localStorage.getItem("userId");
}

export default function PassengerProfilePage() {
  const [passengerId, setPassengerId] = useState(null);
  const [passengerProfile, setPassengerProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
  });
  const userId = useUserId();

  // 1. Obtener el passengerId a partir del userId
  useEffect(() => {
    axiosInstance
      .get(`/usuario/profile/PassengerId/${userId}`)
      .then((response) => {
        setPassengerId(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

  // 2. Obtener el perfil del pasajero a partir del passengerId
  useEffect(() => {
    if (!passengerId) return;
    axiosInstance
      .get(`/usuario/profile/pasajero/${passengerId}`)
      .then((response) => {
        setPassengerProfile(response.data);
        setEditValues({
          nombres: response.data.nombre,
          apellidos: response.data.apellidos,
          correo: response.data.correo,
          telefono: response.data.telefono,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [passengerId]);

  // 3. Mostrar loader si aún no hay datos
  if (!passengerProfile) {
    return (
      <MainLayout>
        <Box py={10} textAlign="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  // 4. Handlers para edición
  const handleChange = (field) => (e) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);

  const handleFinish = async () => {
    setEditMode(false);
    setPassengerProfile({ ...passengerProfile, ...editValues });

    // PATCH/PUT para guardar los cambios en el backend
    try {
      await axiosInstance.put(`/usuario/profile/${userId}`, {
        nombres: editValues.nombres,
        apellidos: editValues.apellidos,
        correo: editValues.correo,
        telefono: editValues.telefono,
      });
      // Opcional: mostrar mensaje de éxito o refrescar datos
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  // 5. Renderizado
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
            position: "relative",
          }}
        >
          {/* Lápiz o botón Finalizar en la esquina */}
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            {!editMode ? (
              <IconButton onClick={handleEdit} aria-label="Editar perfil">
                <EditRoundedIcon />
              </IconButton>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleFinish}
                sx={{ fontWeight: 600 }}
              >
                Finalizar
              </Button>
            )}
          </Box>
          <Stack spacing={4}>
            <FieldLine
              label="NOMBRE(S)"
              value={editValues.nombres}
              onChange={handleChange("nombres")}
              disabled={!editMode}
            />
            <FieldLine
              label="APELLIDO(S)"
              value={editValues.apellidos}
              onChange={handleChange("apellidos")}
              disabled={!editMode}
            />
            <FieldLine
              label="CORREO ELECTRONICO"
              value={editValues.correo}
              onChange={handleChange("correo")}
              disabled={!editMode}
            />
            <FieldLine
              label="TELÉFONO"
              value={editValues.telefono}
              onChange={handleChange("telefono")}
              disabled={!editMode}
            />
          </Stack>
        </Box>
      </Box>
    </MainLayout>
  );
}

/* ───────────────────────── componente campo ───────────────────────── */
function FieldLine({ label, value, onChange, disabled }) {
  return (
    <Box sx={{ mb: 0 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.2, mt: -1.2, fontWeight: 600, color: "common.black" }}
      >
        {label}
      </Typography>
      <RoundedTextField
        value={value}
        fullWidth
        size="small"
        onChange={onChange}
        disabled={disabled}
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          "& .Mui-disabled": { color: "black" },
        }}
      />
    </Box>
  );
}