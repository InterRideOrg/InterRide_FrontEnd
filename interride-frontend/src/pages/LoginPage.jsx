import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/** --------------------------------------------------------
 *  LoginPage – vista de inicio de sesión (HU‑02)
 *  Basada en los mock‑ups de Figma facilitados.
 *  ▸ Se apoya en Material UI v5 y en el theme global definido
 *    en src/theme.js (ver ejemplo de creación más abajo).
 *  ▸ Colores, tipografías y espaciados siguen la guía de estilo
 *    (primary #325B6B, secondary #B0BEC5, etc.).
 *  ▸ No gestiona lógica aún; el submit se propagará mediante
 *    props.onSubmit({ correo, password }) en una iteración futura.
 * ------------------------------------------------------- */

/* ----------  Estilos «utility»  ---------- */
const Background = styled("main")(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.primary.light, // #E3F2FD
  display: "flex",
  flexDirection: "column",
}));

const FormCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark, // #325B6B
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  width: "100%",
  maxWidth: 520,
  alignSelf: "center",
  boxShadow: theme.shadows[4],
}));

/* ----------  Componente  ---------- */
export default function LoginPage() {
  // manejadores locales (placeholder)
  const handleSubmit = e => {
    e.preventDefault();
    // recoger datos y delegar…
  };

  return (
    <Background>
      {/* BARRA SUPERIOR */}
      <AppBar position="static" color="primary" sx={{ py: 1 }}>
        <Toolbar>
          {/* TODO: sustituir por SVG/logo */}
          <ArrowForwardIosIcon sx={{ mr: 1, transform: "rotate(180deg)" }} />
          <Typography variant="h6" noWrap>
            INTER<strong>RIDE</strong>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO */}
      <Container sx={{ my: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Bienvenido
        </Typography>

        <FormCard component="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Usuario */}
            <Box>
              <Typography variant="subtitle1" color="common.white" gutterBottom>
                Usuario o email
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="example@example.com"
                InputProps={{ sx: { backgroundColor: "common.white" } }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography variant="subtitle1" color="common.white" gutterBottom>
                Contraseña
              </Typography>
              <TextField
                type="password"
                fullWidth
                required
                placeholder="*************"
                InputProps={{ sx: { backgroundColor: "common.white" } }}
              />
              <Box textAlign="right" mt={1}>
                <Link href="#" underline="hover" color="common.white" sx={{ fontSize: 14 }}>
                  Contraseña Olvidada
                </Link>
              </Box>
            </Box>

            {/* Botón principal */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ borderRadius: 9999, alignSelf: "center", width: 180 }}
            >
              Iniciar Sesión
            </Button>

            {/* Divider / Social */}
            <Divider flexItem sx={{ borderColor: "primary.light" }}>or sign up with</Divider>
            <Stack direction="row" spacing={3} justifyContent="center">
              <IconButton color="inherit" size="large" sx={{ backgroundColor: "common.white" }}>
                <GoogleIcon />
              </IconButton>
              <IconButton color="inherit" size="large" sx={{ backgroundColor: "common.white" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="large" sx={{ backgroundColor: "common.white" }}>
                <FingerprintIcon />
              </IconButton>
            </Stack>

            <Typography align="center" color="common.white" sx={{ mt: 2 }}>
              ¿No tienes una cuenta?{' '}
              <Link href="#" underline="hover" color="secondary.light">
                Regístrate
              </Link>
            </Typography>
          </Stack>
        </FormCard>
      </Container>
    </Background>
  );
}