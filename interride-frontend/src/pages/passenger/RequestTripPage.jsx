import {
    Box,
    Grid,
    TextField,
    Typography,
  } from "@mui/material";
  import dayjs from "dayjs";
  import { useState } from "react";
  import { LocalizationProvider } from "@mui/x-date-pickers";
  import { DatePicker } from "@mui/x-date-pickers/DatePicker";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  
  import MainLayout from "../../components/layout/MainLayout";
  import FormCard from "../../components/ui/FormCard";
  import LargeActionButton from "../../components/ui/LargeActionButton";
  
  export default function RequestTripPage() {
    const [form, setForm] = useState({
      from: "",
      to: "",
      qty: "",
      date: dayjs(),
    });
  
    const handle =
      (field) =>
      (value) =>
        setForm({
          ...form,
          [field]: value?.$d ? value : value.target.value,
        });
  
    const submit = (e) => {
      e.preventDefault();
      alert(JSON.stringify(form, null, 2)); // ⬅︎ placeholder
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
              // Remove maxWidth: "none" to let the MainLayout control the maximum width
              p: { xs: 3, md: 4 },
              maxWidth: 870,
              bgcolor: "primary.dark",
            }}
          >
            {/* ---------- GRID A DOS COLUMNAS ---------- */}
            <Grid container spacing={6}>
              {/* ---------- COLUMNA IZQUIERDA ---------- */}
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
                  value={form.from}
                  onChange={handle("from")}
                  sx={{ bgcolor: "#fff", borderRadius: 2, mb: 4 }}
                />
  
                {/* Mapa */}
                <Typography color="common.white" mb={1}>
                  Ajusta La Dirección En El Mapa
                </Typography>
                <Box
                  sx={{
                    width: 1,
                    aspectRatio: "1 / 1",
                    borderRadius: 2,
                    background:
                      "url(https://placehold.co/800x800?text=Mapa) center/cover",
                  }}
                />
              </Grid>
  
              {/* ---------- COLUMNA DERECHA ---------- */}
              <Grid
                item
                xs={12}
                md={6}
                display="flex"
                flexDirection="column"
                /* desplaza todo un poco hacia abajo para alinear “Hasta” con “Desde” */
                mt={{ xs: 0, md: 7 }} // ← ajuste de alineación
              >
                {/* --- campos superiores --- */}
                <Box>
                  {/* Hasta */}
                  <Typography color="common.white" mb={1}>
                    Hasta:
                  </Typography>
                  <TextField
                    fullWidth
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
  
                {/* --- botón --- */}
                <LargeActionButton
                  type="submit"
                  fullWidth // prop interna que estira el botón
                  sx={{ mt: 13 }} // espacio respecto al bloque superior
                >
                  Solicitar Viaje
                </LargeActionButton>
              </Grid>
            </Grid>
          </FormCard>
        </form>
      </MainLayout>
    );
  }