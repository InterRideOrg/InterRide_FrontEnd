import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ImageIcon from "@mui/icons-material/Image";

const DriverProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  

  // Datos de ejemplo
  const user = {
    nombre: "Juan Perez Perez",
    email: "example@example.com",
    telefono: "987654321",
    password: "supersecreto",
  };
  const vehiculo = {
    placa: "ABC-1234",
    marca: "Toyota",
    modelo: "Corolla",
    anio: "2020",
  };

  return (
    <>
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

        {/* Avatares */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
        >
          <Box textAlign="center" flex={1}>
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "grey.900",
                mx: "auto",
                mb: 1,
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 120 }} />
            </Avatar>
            <IconButton>
              <ImageIcon />
            </IconButton>
          </Box>
          <Box textAlign="center" flex={1}>
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "grey.900",
                mx: "auto",
                mb: 1,
              }}
            >
              <DirectionsCarFilledIcon sx={{ fontSize: 100 }} />
            </Avatar>
            <IconButton>
              <ImageIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Cuerpo */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          mt={2}
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
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Mis Datos Personales
            </Typography>
            <Stack spacing={2}>
              <FieldLine label="Nombre completo" value={user.nombre} />
              <FieldLine label="Email" value={user.email} />
              <FieldLine label="Numero de telefono" value={user.telefono} />
              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={user.password}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        <VisibilityOffIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .Mui-disabled": { color: "black" },
                }}
              />
            </Stack>
          </Paper>

          {/* Datos vehículo */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#36a3ad",
              borderRadius: 3,
              p: 3,
              minWidth: 320,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Datos De Mi Vehículo
            </Typography>
            <Stack spacing={2}>
              <FieldLine label="Placa" value={vehiculo.placa} />
              <FieldLine label="Marca" value={vehiculo.marca} />
              <FieldLine label="Modelo" value={vehiculo.modelo} />
              <FieldLine label="Año" value={vehiculo.anio} />
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>    
    </>

  );
}

function FieldLine({ label, value }) {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      size="small"
      disabled
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <EditRoundedIcon sx={{ color: "grey.600", opacity: 0.7 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        "& .Mui-disabled": { color: "black" },
      }}
    />
  );
}

export default DriverProfilePage;