import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';
import FormCard from '../components/layout/FormCard';        // tu card azul oscuro
import RoundedTextField from '../components/ui/RoundedTextField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // 👉 TODO: llamar a /auth/forgot-password
    console.log('Email enviado:', email);
  };

  return (
    <AuthLayout title="¿Se Olvidó Su Contraseña?">
      {/* ---- subtítulo ---- */}
        <Typography
        variant="body1"
        sx={{
            /** centro y anchura responsiva */
            textAlign: 'center',
            maxWidth: { xs: '90%', sm: 460 }, // 90 % en móviles, 460 px en ≥ 600 px
            mx: 'auto',                       // ←  margen izquierdo y derecho auto
            mb: 6,
            lineHeight: 1.35,
        }}
        >
        Ingrese el email con el que creó su cuenta; le enviaremos un correo con
        los pasos para reiniciar su contraseña.
        </Typography>


      {/* ---- formulario reutilizando FormCard ---- */}
      <FormCard component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" color="common.white" mb={1}>
              Usuario o email
            </Typography>

            {/* Nuestro input reutilizable */}
            <RoundedTextField
              required
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Box>
        </Stack>
      </FormCard>

      {/* ---- botón ---- */}
      <Box textAlign="center" mt={6}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ borderRadius: 9999, width: 200 }}
          onClick={handleSubmit}
        >
          Continuar
        </Button>
      </Box>
    </AuthLayout>
  );
}
