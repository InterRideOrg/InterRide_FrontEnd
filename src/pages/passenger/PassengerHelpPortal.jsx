import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import SendIcon from "@mui/icons-material/Send";
import MainLayout from "../../components/layout/MainLayout";
import axiosInstance from "../../interceptors/axiosInstance";

function useUserId() {
  return localStorage.getItem("userId");
}

export default function PassengerHelpPortal() {
  const [mensaje, setMensaje] = useState("");
  const [idPasajero, setIdPasajero] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const userId = useUserId();

  useEffect(() => {
    if (!userId) return;
    axiosInstance
      .get(`/usuario/profile/PassengerId/${userId}`)
      .then((res) => setIdPasajero(res.data))
      .catch(() => setError("No se pudo obtener tu ID de pasajero."));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      await axiosInstance.post("/reclamo/enviar", {
        mensaje,
        idPasajero,
        idConductor: null,
      });
      setSuccess(true);
      setMensaje("");
    } catch {
      setError("No se pudo enviar el reclamo.");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: "#e3f2fd", minHeight: "100vh", px: 0, py: 4 }}>
        <Box px={{ xs: 2, md: 8 }}>
          {/* Título */}
          <Typography variant="h5" fontWeight={700} mt={2} mb={2}>
            Portal De Ayuda
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={3}
            mt={2}
          >
            Hola! Cómo podemos ayudarte?
          </Typography>

          {/* Buscador + Reclamo */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <form
              style={{ width: "100%", maxWidth: 700 }}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <TextField
                placeholder="Escribe tu pregunta..."
                variant="outlined"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                fullWidth
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 18,
                    px: 2,
                    py: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={!mensaje || !idPasajero}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            {/* Mensajes de éxito y error */}
            <Box width="100%" maxWidth={700} mt={2}>
              {success && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Reclamo enviado correctamente.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>

          {/* Cuerpo */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {/* Contacto */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                bgcolor: "#456977",
                color: "white",
                borderRadius: 3,
                p: 3,
                minWidth: 320,
                mb: { xs: 2, md: 0 },
              }}
            >
              <Typography fontWeight={700} fontSize={20} mb={2}>
                ¿NECESITAS CONTACTARNOS?
              </Typography>
              <Typography fontSize={16} mb={2}>
                Aquí Tienes Nuestros Medios Oficiales:
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon fontSize="large" />
                  <Typography fontSize={16}>
                    InterRidePeru@Gmail.Com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <PhoneIcon fontSize="large" />
                  <Typography fontSize={16}>
                    +51 987 654 321
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <InstagramIcon fontSize="large" />
                  <Typography fontSize={16}>
                    @InterRide
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <TwitterIcon fontSize="large" />
                  <Typography fontSize={16}>
                    @InterRide_Oficial
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <HeadsetMicIcon fontSize="large" />
                  <Typography fontSize={16}>
                    Atención 24/7
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Preguntas frecuentes */}
            <Paper
              elevation={0}
              sx={{
                flex: 2,
                bgcolor: "#456977",
                color: "white",
                borderRadius: 3,
                p: 3,
                minWidth: 320,
              }}
            >
              <Typography fontWeight={700} fontSize={20} mb={2}>
                PREGUNTAS FRECUENTES
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    1. ¿Cómo Funciona El Servicio De Viajes Interprovinciales?
                  </Typography>
                  <Typography fontSize={15}>
                    Conectamos a pasajeros con conductores verificados que realizan rutas interprovinciales. Tú eliges el origen, destino, horario y propones un precio justo. Los conductores interesados pueden aceptar tu oferta o negociar.
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    2. ¿Es Seguro Viajar Con Conductores Particulares?
                  </Typography>
                  <Typography fontSize={15}>
                    Sí. Todos los conductores pasan por un proceso de verificación de identidad y documentos del vehículo. Además, puedes revisar calificaciones y comentarios de otros usuarios antes de aceptar un viaje.
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    3. ¿Cómo Puedo Pagar El Viaje?
                  </Typography>
                  <Typography fontSize={15}>
                    El pago se realiza directamente al conductor, ya sea en efectivo o a través de métodos de pago acordados entre ambas partes.
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    4. ¿Qué Pasa Si Necesito Cancelar Un Viaje?
                  </Typography>
                  <Typography fontSize={15}>
                    Puedes cancelar en cualquier momento antes de que el viaje comience. Te recomendamos notificar al conductor con la mayor anticipación posible. Sé cordial, respeta y evita penalizaciones.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </MainLayout>
  );
}