import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RoundedTextField from "../../components/ui/RoundedTextField";
import axiosInstance from "../../interceptors/axiosInstance";

/* ────────────── Hook para obtener el id del usuario desde localStorage ────────────── */
function useUserId() {
  return localStorage.getItem("userId");
}

export default function DriverProfilePage() {
  // Datos personales
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [editValues, setEditValues] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
  });

  // Vehículo
  const [vehicle, setVehicle] = useState({
    marca: "",
    modelo: "",
    placa: "",
    anio: "",
    cantidadAsientos: "",
  });
  const [vehicleEditMode, setVehicleEditMode] = useState(false);
  const [vehicleExists, setVehicleExists] = useState(false);
  const [vehicleEditValues, setVehicleEditValues] = useState({
    marca: "",
    modelo: "",
    placa: "",
    anio: "",
    cantidadAsientos: "",
  });

  const userId = useUserId();

  // Datos personales
  useEffect(() => {
    if (!userId) return;
    axiosInstance
      .get(`/usuario/profile/${userId}`)
      .then((res) => {
        setProfile(res.data);
        setEditValues({
          nombre: res.data.nombre,
          apellidos: res.data.apellidos,
          correo: res.data.correo,
          telefono: res.data.telefono,
        });
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    // Obtener driverId
    axiosInstance
      .get(`/usuario/profile/DriverId/${userId}`)
      .then((res) => {
        setDriverId(res.data);
      })
      .catch((err) => {
        console.error("Error obteniendo driverId:", err);
      });
  }, [userId]);


  // Vehículo
  const fetchVehicle = (driverId) => {
    axiosInstance
      .get(`/vehiculo/${driverId}`)
      .then((res) => {
        setVehicle(res.data);
        setVehicleEditValues({
          marca: res.data.marca,
          modelo: res.data.modelo,
          placa: res.data.placa,
          anio: res.data.anio,
          cantidadAsientos: res.data.cantidadAsientos,
        });
        setVehicleExists(true);
        setVehicleEditMode(false);
      })
      .catch((err) => {
        setVehicle({
          marca: "",
          modelo: "",
          placa: "",
          anio: "",
          cantidadAsientos: "",
        });
        setVehicleEditValues({
          marca: "",
          modelo: "",
          placa: "",
          anio: "",
          cantidadAsientos: "",
        });
        setVehicleExists(false);
        setVehicleEditMode(false);
      });
  };

  useEffect(() => {
    if (!driverId) return;
    fetchVehicle(driverId);
    // eslint-disable-next-line
  }, [driverId]);

  // Handlers datos personales
  const handleChange = (field) => (e) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);

  const handleFinish = async () => {
    setEditMode(false);
    setProfile({ ...profile, ...editValues });
    try {
      await axiosInstance.put(`/usuario/profile/${userId}`, {
        nombre: editValues.nombre,
        apellidos: editValues.apellidos,
        correo: editValues.correo,
        telefono: editValues.telefono,
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  // Handlers vehículo
  const handleVehicleChange = (field) => (e) => {
    setVehicleEditValues({ ...vehicleEditValues, [field]: e.target.value });
  };

  const handleVehicleEdit = () => setVehicleEditMode(true);

  const handleVehicleRegister = async () => {
    try {
      await axiosInstance.post(`/vehiculo/registrar/${userId}`, {
        marca: vehicleEditValues.marca,
        modelo: vehicleEditValues.modelo,
        placa: vehicleEditValues.placa,
        anio: vehicleEditValues.anio,
        cantidadAsientos: vehicleEditValues.cantidadAsientos,
      });
      fetchVehicle(driverId); // Refresca datos y cambia la vista
    } catch (error) {
      console.error("Error al registrar vehículo:", error);
    }
  };

  const handleVehicleUpdate = async () => {
    try {
      await axiosInstance.put(`/vehiculo/actualizar/${driverId}`, {
        marca: vehicleEditValues.marca,
        modelo: vehicleEditValues.modelo,
        placa: vehicleEditValues.placa,
        anio: vehicleEditValues.anio,
        cantidadAsientos: vehicleEditValues.cantidadAsientos,
      });
      fetchVehicle(driverId); // Refresca datos y cambia la vista
    } catch (error) {
      console.log("Response error:", error.response);
      console.error("Error al actualizar vehículo:", error);
    }
  };

  // Render
  return (
      <Box sx={{ bgcolor: "#e3f2fd", minHeight: "100vh", px: 0, py: 4 }}>
        <Box px={{ xs: 2, md: 8 }}>
          {/* Encabezado */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={700}>
              Mi Cuenta De Usuario
            </Typography>
            <Button
              variant="outlined"
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: 1,
                fontWeight: 600,
                px: 3,
                py: 1,
                ":hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
          {/* Iconos de usuario y vehículo al mismo nivel */}
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
          {/* Datos personales y vehículo */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            mt={2}
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
              <Typography variant="h6" fontWeight={700} mb={2} align="center">
                Mis Datos Personales
              </Typography>
              <Stack spacing={2}>
                <FieldLine
                  label="Nombre"
                  value={editValues.nombre}
                  onChange={handleChange("nombre")}
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
                  label="Username"
                  value={profile?.username || ""}
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
                mt: { xs: 4, md: 0 },
              }}
            >
              <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                {!vehicleExists ? (
                  !vehicleEditMode ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setVehicleEditMode(true)}
                      sx={{ fontWeight: 600 }}
                    >
                      Registrar
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={handleVehicleRegister}
                      sx={{ fontWeight: 600 }}
                    >
                      Finalizar
                    </Button>
                  )
                ) : !vehicleEditMode ? (
                  <IconButton onClick={handleVehicleEdit} aria-label="Editar vehículo">
                    <EditRoundedIcon />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleVehicleUpdate}
                    sx={{ fontWeight: 600 }}
                  >
                    Finalizar
                  </Button>
                )}
              </Box>
              <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
                Vehículo
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
                  label="Cantidad de Asientos"
                  value={vehicleEditValues.cantidadAsientos}
                  onChange={handleVehicleChange("cantidadAsientos")}
                  disabled={!vehicleEditMode}
                />
              </Stack>
              {!vehicleExists && (
                <Typography variant="body2" color="text.secondary" mt={2}>
                  * No tienes un vehículo registrado. Completa los campos y presiona Registrar.
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}

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

function FieldLineNoEdit({ label, value }) {
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