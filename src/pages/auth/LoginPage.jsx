import { useState, useMemo } from 'react';
import { useNavigate }       from 'react-router-dom';
import axiosInstancePublic   from '../../interceptors/axiosInstancePublic';
import { useAuth }           from '../../auth/AuthContext';

import {
  Typography, Stack, Box, Divider, IconButton, Link
} from '@mui/material';
import GoogleIcon    from '@mui/icons-material/Google';

import AuthLayout    from '../../components/layout/AuthLayout';
import FormCard      from '../../components/ui/FormCard';
import AuthTextField from '../../components/inputs/AuthTextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate          = useNavigate();
  const { login: setAuth} = useAuth();

  const [form,   setForm]   = useState({ correo: '', password: '' });
  const [errors, setErr]    = useState({});
  const [touched,setTouch ] = useState({});
  const [submitted, setSub] = useState(false);
  const [apiError,setApiErr]= useState(null);

  /* ---------- handlers ---------- */
  const handleChange = field => e =>
    setForm({ ...form, [field]: e.target.value });

  const handleBlur   = field => () =>
    setTouch({ ...touched, [field]: true });

  /* ---------- validación rápida ---------- */
  useMemo(() => {
    const e = {};
    if (!emailRx.test(form.correo)) e.correo = 'Correo inválido';
    if (!form.password.trim())      e.password = 'Contraseña requerida';
    setErr(e);
  }, [form]);

  /* ---------- submit ---------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setSub(true);
    if (Object.keys(errors).length) return;

    try {
      setApiErr(null);
      /* 🔐 llamada al backend */
      const { data } = await axiosInstancePublic.post('/auth/login', form);
      // data = { token, username, role, userId }

      /* 1) Persistencia básica en localStorage */
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole',  data.role);
      localStorage.setItem('userId',    data.userId);

      /* 2) Guardamos en contexto */
      setAuth({
        token : data.token,
        role  : data.role,
        userId: data.userId
      });

      /* 3) Redirección inteligente */
      navigate(
        data.role === 'PASAJERO'
          ? `/passenger/home/${data.userId}`
          : `/driver/profile/${data.userId}`,
        { replace: true }
      );

    } catch (err) {
      console.error(err);
      setApiErr('Credenciales incorrectas');
    }
  };

  const show = f => submitted || touched[f];

  /* ---------- UI ---------- */
  return (
    <AuthLayout title="Bienvenido">
      <FormCard component="form" onSubmit={handleSubmit}>
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
              onBlur={handleBlur('correo')}
              error={show('correo') && !!errors.correo}
              helperText={show('correo') && errors.correo}
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
              onBlur={handleBlur('password')}
              error={show('password') && !!errors.password}
              helperText={show('password') && errors.password}
            />
            <Box textAlign="right" mt={1}>
              <Link href="/forgot-password" underline="hover" color="common.white" fontSize={14}>
                Contraseña olvidada
              </Link>
            </Box>
          </Box>

          {apiError && (
            <Typography color="error.main" align="center">
              {apiError}
            </Typography>
          )}

          <PrimaryButton type="submit">Iniciar sesión</PrimaryButton>

          <Divider sx={{ borderColor: 'primary.light' }}>o ingresa con</Divider>

          <Stack direction="row" spacing={3} justifyContent="center">
            <IconButton sx={{ bgcolor: 'common.white' }}>
              <GoogleIcon />
            </IconButton>
          </Stack>

          <Typography align="center" color="common.white">
            ¿No tienes una cuenta?{' '}
            <Link href="/register-passenger" underline="hover" color="secondary.light">
              Regístrate
            </Link>
          </Typography>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
