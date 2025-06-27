import {
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import MainLayout from "../../components/layout/MainLayout";
import FormCard from "../../components/ui/FormCard";
import LargeActionButton from "../../components/ui/LargeActionButton";
import axiosInstance from "../../interceptors/axiosInstance";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
};

// Utilidad para extraer provincia (penúltimo segmento de la dirección)
function extractProvince(address) {
  const parts = address.split(",").map((part) => part.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : "Provincia Desconocida";
}

export default function RequestTripPage() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    qty: "",
    date: dayjs(),
    fromCoords: null,
    toCoords: null,
  });

  const fromInput = useRef();
  const toInput = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded) return;

    const autocompleteFrom = new window.google.maps.places.Autocomplete(
      fromInput.current
    );
    autocompleteFrom.addListener("place_changed", () => {
      const place = autocompleteFrom.getPlace();
      setForm((prev) => ({
        ...prev,
        from: place.formatted_address,
        fromCoords: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      }));
    });

    const autocompleteTo = new window.google.maps.places.Autocomplete(
      toInput.current
    );
    autocompleteTo.addListener("place_changed", () => {
      const place = autocompleteTo.getPlace();
      setForm((prev) => ({
        ...prev,
        to: place.formatted_address,
        toCoords: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      }));
    });
  }, [isLoaded]);

  const handle =
    (field) =>
    (value) =>
      setForm({
        ...form,
        [field]: value?.$d ? value : value.target.value,
      });

  const submit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.fromCoords || !form.toCoords) {
      alert("Por favor, selecciona ubicaciones válidas desde el autocompletado.");
      return;
    }

    if (parseInt(form.qty) <= 0) {
      alert("La cantidad de personas debe ser mayor a 0.");
      return;
    }

    if (dayjs(form.date).isBefore(dayjs(), "day")) {
      alert("No puedes seleccionar una fecha pasada.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const profileRes = await axiosInstance.get(`/usuario/profile/${userId}`);
      const pasajeroId = profileRes.data.id;

      const requestData = {
        fechaHoraPartida: form.date.toISOString(),
        asientosReservados: parseInt(form.qty),
        latitudOrigen: form.fromCoords.lat,
        longitudOrigen: form.fromCoords.lng,
        provinciaOrigen: extractProvince(form.from),
        direccionOrigen: form.from,

        latitudDestino: form.toCoords.lat,
        longitudDestino: form.toCoords.lng,
        provinciaDestino: extractProvince(form.to),
        direccionDestino: form.to,
      };

      await axiosInstance.post(`/trips/solicitar/${pasajeroId}`, requestData);

      alert("¡Solicitud enviada correctamente!");
      // Opcional: limpiar formulario o redirigir
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar la solicitud.");
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Solicitar Nuevo Viaje
      </Typography>

      <form onSubmit={submit}>
        <FormCard
          sx={{
            width: 1,
            p: { xs: 3, md: 4 },
            maxWidth: 870,
            bgcolor: "primary.dark",
          }}
        >
          <Grid container spacing={6}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="common.white" mb={3}>
                Ingresa Las Direcciones
              </Typography>

              {/* Desde */}
              <Typography color="common.white" mb={1}>
                Desde:
              </Typography>
              <TextField
                fullWidth
                inputRef={fromInput}
                value={form.from}
                onChange={handle("from")}
                sx={{ bgcolor: "#fff", borderRadius: 2, mb: 4 }}
              />

              {/* Mapa */}
              <Typography color="common.white" mb={1}>
                Ajusta La Dirección En El Mapa
              </Typography>
              <Box sx={{ width: 1, aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden" }}>
                {isLoaded && form.fromCoords && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={form.fromCoords}
                    zoom={13}
                  >
                    <Marker position={form.fromCoords} />
                    {form.toCoords && <Marker position={form.toCoords} />}
                  </GoogleMap>
                )}
              </Box>
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6} display="flex" flexDirection="column" mt={{ xs: 0, md: 7 }}>
              <Box>
                {/* Hasta */}
                <Typography color="common.white" mb={1}>
                  Hasta:
                </Typography>
                <TextField
                  fullWidth
                  inputRef={toInput}
                  value={form.to}
                  onChange={handle("to")}
                  sx={{ bgcolor: "#fff", borderRadius: 2, mb: 4 }}
                />

                {/* Cantidad */}
                <Typography color="common.white" mb={1}>
                  Ingresa Cantidad De Personas
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={form.qty}
                  onChange={handle("qty")}
                  inputProps={{ min: 1 }}
                  sx={{ bgcolor: "#fff", borderRadius: 2, mb: 4 }}
                />

                {/* Fecha */}
                <Typography color="common.white" mb={1}>
                  Ingresa La Fecha Del Viaje
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disablePast
                    value={form.date}
                    onChange={handle("date")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { bgcolor: "#fff", borderRadius: 2 },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <LargeActionButton type="submit" fullWidth sx={{ mt: 13 }}>
                Solicitar Viaje
              </LargeActionButton>
            </Grid>
          </Grid>
        </FormCard>
      </form>
    </MainLayout>
  );
}
