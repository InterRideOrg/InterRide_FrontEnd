import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import FormCard from '../components/layout/FormCard';
import AuthTextField from '../components/inputs/AuthTextField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import {
  Stack, Box, Typography, Checkbox, FormControlLabel,
} from '@mui/material';

export default function RegisterPage() {
  const handleSubmit = e => { e.preventDefault(); };

  return (
    <AuthLayout title="Empecemos">
      <FormCard onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {[
            ['Nombre completo', 'Juan Perez'],
            ['Email', 'example@example.com', 'email'],
            ['Número de teléfono', '987654321', 'tel'],
            ['Contraseña', '********', 'password'],
            ['Confirmar contraseña', '********', 'password'],
          ].map(([label, placeholder, type = 'text']) => (
            <Box key={label}>
              <Typography variant="subtitle1" color="common.white">{label}</Typography>
              <AuthTextField placeholder={placeholder} type={type} />
            </Box>
          ))}

          <FormControlLabel
            sx={{ color: 'common.white' }}
            control={<Checkbox sx={{ color: 'common.white' }} />}
            label="Quiero ser conductor"
          />

          <Box>
            <Typography variant="subtitle1" color="common.white">Matrícula</Typography>
            <AuthTextField placeholder="ABC-123" />
          </Box>

          <PrimaryButton>Regístrate</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
