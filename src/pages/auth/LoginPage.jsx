import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import AuthTextField from '../../components/inputs/AuthTextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {
  Typography, Stack, Box, Divider, IconButton, Link,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

export default function LoginPage() {
  const handleSubmit = e => { e.preventDefault(); /* … */ };

  return (
    <AuthLayout title="Bienvenido">
      <FormCard onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" color="common.white">Usuario o email</Typography>
            <AuthTextField placeholder="example@example.com" />
          </Box>

          <Box>
            <Typography variant="subtitle1" color="common.white">Contraseña</Typography>
            <AuthTextField type="password" placeholder="************" />
            <Box textAlign="right" mt={1}>
              <Link href="/forgot-password" underline="hover" color="common.white" fontSize={14}>
                Contraseña Olvidada
              </Link>
            </Box>
          </Box>

          <PrimaryButton>Iniciar Sesión</PrimaryButton>

          <Divider flexItem sx={{ borderColor: 'primary.light' }}>or sign up with</Divider>

          <Stack direction="row" spacing={3} justifyContent="center">
            {[GoogleIcon, FacebookIcon, FingerprintIcon].map((Icon, i) => (
              <IconButton key={i} sx={{ backgroundColor: 'common.white' }}>
                <Icon />
              </IconButton>
            ))}
          </Stack>

          <Typography align="center" color="common.white">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" underline="hover" color="secondary.light">
              Regístrate
            </Link>
          </Typography>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
