import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import AuthLayout      from '../../components/layout/AuthLayout';
import FormCard        from '../../components/ui/FormCard';
import RoundedTextField from '../../components/ui/RoundedTextField';
// …

export default function ResetPasswordPage() {
  const handleSubmit = e => {
    e.preventDefault();
    /* TODO: enviar token + pass */
  };

  return (
    <AuthLayout title="Nueva Contraseña">
      <form onSubmit={handleSubmit}>
      <FormCard sx={{ maxWidth: 480, mx: 'auto' }}>
        <Stack spacing={4}>
            {/* ----- Contraseña ----- */}
            <Box>
            <Typography variant="subtitle1" color="common.white" gutterBottom>
                Contraseña
            </Typography>
            <RoundedTextField
                name="password"
                type="password"
                required
            />
            </Box>

            {/* ----- Confirmar ----- */}
            <Box>
            <Typography variant="subtitle1" color="common.white" gutterBottom>
                Confirmar contraseña
            </Typography>
            <RoundedTextField
                name="confirmPassword"
                type="password"
                required
            />
            </Box>
        </Stack>
        </FormCard>


        {/* botón principal */}
        <Box textAlign="center" mt={4}>
          <Button type="submit" variant="outlined" size="large">
            Continuar
          </Button>
        </Box>
      </form>
    </AuthLayout>
  );
}
