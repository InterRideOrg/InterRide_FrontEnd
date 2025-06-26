import React from 'react';
import { useState }            from 'react';
import { useNavigate }         from 'react-router-dom';
import axios                   from 'axios';
import axiosInstancePublic from "../../interceptors/axiosInstancePublic";
import {
  Typography, Stack, Box, Divider, IconButton, Link,
} from '@mui/material';
import GoogleIcon             from '@mui/icons-material/Google';
import FacebookIcon           from '@mui/icons-material/Facebook';
import FingerprintIcon        from '@mui/icons-material/Fingerprint';

import AuthLayout       from '../../components/layout/AuthLayout';
import FormCard         from '../../components/ui/FormCard';
import AuthTextField    from '../../components/inputs/AuthTextField';
import PrimaryButton    from '../../components/buttons/PrimaryButton';

export default function LoginPage() {
  const navigate = useNavigate();

  /* 🔐 Campos controlados */
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = field => e =>
    setForm({ ...form, [field]: e.target.value });

  /*  Submit */
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      // ⬇️ cliente PÚBLICO
      const { data } = await axiosInstancePublic.post('/auth/login', form);

      // 1️ Guardar token y role
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);

      // 2️ Redirigir según el rol
      if (data.role === 'PASAJERO') {
        navigate(`/passenger/home/${data.userId}`, { replace: true });
      } else if (data.role === 'CONDUCTOR') {
        navigate(`/driver/home/${data.userId}`, { replace: true });
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <AuthLayout title="Bienvenido">
      <FormCard onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Correo */}
          <Box>
            <Typography variant="subtitle1" color="common.white">
              Usuario o email
            </Typography>
            <AuthTextField
              placeholder="example@example.com"
              value={form.correo}
              onChange={handleChange('correo')}
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography variant="subtitle1" color="common.white">
              Contraseña
            </Typography>
            <AuthTextField
              type="password"
              placeholder="************"
              value={form.password}
              onChange={handleChange('password')}
            />
            <Box textAlign="right" mt={1}>
              <Link href="/forgot-password" underline="hover" color="common.white" fontSize={14}>
                Contraseña olvidada
              </Link>
            </Box>
          </Box>

          {error && (
            <Typography color="error.main" align="center">
              {error}
            </Typography>
          )}

          {/* Submit */}
          <PrimaryButton type="submit">Iniciar Sesión</PrimaryButton>
          <Typography align="center" color="common.white">
            <Divider flexItem sx={{ borderColor: 'primary.light' }}>o ingresa con</Divider>
          </Typography>
          {/* Social */}
          <Stack direction="row" spacing={3} justifyContent="center">
            {[GoogleIcon
            //, FacebookIcon, FingerprintIcon
            ].map((Icon, i) => (
              <IconButton key={i} sx={{ backgroundColor: 'common.white' }}>
                <Icon />
              </IconButton>
            ))}
          </Stack>

          {/* Link a registro */}
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
