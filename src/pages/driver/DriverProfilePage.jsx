import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axiosInstance from "../../interceptors/axiosInstance";
import RoundedTextField from "../../components/ui/RoundedTextField";
import { useNavigate } from "react-router-dom";

/* ────────────── Hook para obtener el id del usuario desde localStorage ────────────── */
function useUserId() {
  return localStorage.getItem("userId");
}

export default function DriverProfilePage() {
  const navigate = useNavigate();
  const userId = useUserId();

  const [driverId, setDriverId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    username: "",
  });

  const [vehicle, setVehicle] = useState(null);
  const [vehicleEditValues, setVehicleEditValues] = useState({
    marca: "",
    modelo: "",
    placa: "",
    anio: "",
    cantidadAsientos: "",
  });
  const [vehicleEditMode, setVehicleEditMode] = useState(false);

  // Redirigir si no hay sesión
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!userId || !authToken) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // Obtener datos personales
  useEffect(() => {
    if (!userId) return;
    axiosInstance
      .get(`/usuario/profile/${userId}`)
      .then((res) => {
        setProfile(res.data);
        setEditValues({
          nombres: res.data.nombre,
          apellidos: res.data.apellidos,
          correo: res.data.correo,
          telefono: res.data.telefono,
          username: res.data.username,
        });
      })
      .catch((err) => {
        console.error("Error al obtener perfil:", err);
      });

    axiosInstance
      .get(`/usuario/profile/DriverId/${userId}`)
      .then((res) => {
        setDriverId(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener driverId:", err);
      });
  }, [userId]);

  // Obtener vehículo
  useEffect(() => {
    if (!driverId) return;
    axiosInstance
      .get(`/vehiculo/${driverId}`)
      .then((res) => {
        setVehicle(res.data);
        setVehicleEditValues(res.data);
        setVehicleEditMode(false);
      })
      .catch(() => {
        setVehicle(null); // No hay vehículo
        setVehicleEditValues({
          marca: "",
          modelo: "",
          placa: "",
          anio: "",
          cantidadAsientos: "",
        });
      });
  }, [driverId]);

  // Mostrar loader mientras se cargan los datos
  if (!profile) {
    return (
      <Box py={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // Handlers perfil
  const handleEdit = () => setEditMode(true);
  const handleChange = (field) => (e) =>
    setEditValues({ ...editValues, [field]: e.target.value });
  const handleFinish = async () => {
    setEditMode(false);
    try {
      // Solo enviar los campos editables
      const { nombres, apellidos, correo, telefono } = editValues;
      await axiosInstance.put(`/usuario/profile/${userId}`, {
        nombres,
        apellidos,
        correo,
        telefono,
      });
      setProfile({ ...profile, nombres, apellidos, correo, telefono });
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
    }
  };

  // Handlers vehículo
  const handleVehicleChange = (field) => (e) =>
    setVehicleEditValues({ ...vehicleEditValues, [field]: e.target.value });

  const handleVehicleRegister = async () => {
    try {
      await axiosInstance.post(`/vehiculo/registrar/${userId}`, vehicleEditValues);
      const res = await axiosInstance.get(`/vehiculo/${driverId}`);
      setVehicle(res.data);
      setVehicleEditValues(res.data);
      setVehicleEditMode(false);
    } catch (error) {
      console.error("Error al registrar vehículo:", error);
    }
  };

  const handleVehicleUpdate = async () => {
    try {
      await axiosInstance.put(`/vehiculo/actualizar/${driverId}`, vehicleEditValues);
      setVehicle({ ...vehicleEditValues });
      setVehicleEditMode(false);
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Box sx={{ bgcolor: "#e3f2fd", minHeight: "100vh", px: 0, py: 4 }}>
      <Box px={{ xs: 2, md: 8 }}>
        {/* Encabezado */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Mi Cuenta De Usuario
          </Typography>
          <Button variant="outlined" size="small" onClick={handleLogout}>
            Cerrar&nbsp;sesión
          </Button>
        </Box>

        {/* ───────────── Avatares de usuario y vehículo centrados ───────────── */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            gap={4}
            mb={3}
          >
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "grey.900",
                mx: "auto",
                mb: { xs: 1, md: 0 },
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 120 }} />
            </Avatar>
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "grey.900",
                mx: "auto",
                mb: { xs: 1, md: 0 },
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 120, color: "white" }} />
            </Avatar>
          </Box>

        {/* Información */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          justifyContent="center"
        >
          {/* Datos personales */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#36a3ad",
              borderRadius: 3,
              p: 3,
              minWidth: 320,
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              {!editMode ? (
                <IconButton onClick={handleEdit}>
                  <EditRoundedIcon />
                </IconButton>
              ) : (
                <Button variant="contained" size="small" onClick={handleFinish}>
                  Finalizar
                </Button>
              )}
            </Box>
            <Typography variant="h6" fontWeight={700} mb={2} align="center">
              Mis Datos Personales
            </Typography>
            <Stack spacing={2}>
              <FieldLine
                label="Nombre"
                value={editValues.nombres}
                onChange={handleChange("nombres")}
                disabled={!editMode}
              />
              <FieldLine
                label="Apellidos"
                value={editValues.apellidos}
                onChange={handleChange("apellidos")}
                disabled={!editMode}
              />
              <FieldLine
                label="Email"
                value={editValues.correo}
                onChange={handleChange("correo")}
                disabled={!editMode}
              />
              <FieldLine
                label="Teléfono"
                value={editValues.telefono}
                onChange={handleChange("telefono")}
                disabled={!editMode}
              />
              <FieldLineNoEdit
                label="Nombre de usuario"
                value={editValues.username}
              />
            </Stack>
          </Paper>

          {/* Vehículo */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#36a3ad",
              borderRadius: 3,
              p: 3,
              minWidth: 320,
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              {!vehicle ? (
                vehicleEditMode ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleVehicleRegister}
                  >
                    Finalizar
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setVehicleEditMode(true)}
                  >
                    Registrar
                  </Button>
                )
              ) : vehicleEditMode ? (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={handleVehicleUpdate}
                >
                  Guardar
                </Button>
              ) : (
                <IconButton onClick={() => setVehicleEditMode(true)}>
                  <EditRoundedIcon />
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" fontWeight={700} mb={2} align="center">
              Datos del Vehículo
            </Typography>
            <Stack spacing={2}>
              <FieldLine
                label="Marca"
                value={vehicleEditValues.marca}
                onChange={handleVehicleChange("marca")}
                disabled={!vehicleEditMode}
              />
              <FieldLine
                label="Modelo"
                value={vehicleEditValues.modelo}
                onChange={handleVehicleChange("modelo")}
                disabled={!vehicleEditMode}
              />
              <FieldLine
                label="Placa"
                value={vehicleEditValues.placa}
                onChange={handleVehicleChange("placa")}
                disabled={!vehicleEditMode}
              />
              <FieldLine
                label="Año"
                value={vehicleEditValues.anio}
                onChange={handleVehicleChange("anio")}
                disabled={!vehicleEditMode}
              />
              <FieldLine
                label="Asientos"
                value={vehicleEditValues.cantidadAsientos}
                onChange={handleVehicleChange("cantidadAsientos")}
                disabled={!vehicleEditMode}
              />
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────── Componente para campos de texto ─────────────── */
function FieldLine({ label, value, onChange, disabled }) {
  return (
    <Box>
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

function FieldLineNoEdit({ label, value }) {
  return (
    <Box>
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
        disabled
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          "& .Mui-disabled": { color: "black" },
        }}
      />
    </Box>
  );
}