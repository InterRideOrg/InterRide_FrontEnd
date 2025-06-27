import { useState, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AuthLayout      from '../../components/layout/AuthLayout';
import FormCard        from '../../components/ui/FormCard';
import AuthTextField   from '../../components/inputs/AuthTextField';
import PrimaryButton   from '../../components/buttons/PrimaryButton';

import axiosPublic     from '../../interceptors/axiosInstancePublic';

import './styles/RegisterDriver.css';          /* prefijo rd- en las clases */

/* ───── Expresiones de validación ───── */
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRx = /^\d{7,15}$/;
const userRx  = /^[a-zA-Z0-9_]{3,20}$/;

export default function RegisterDriverPage() {
  const nav = useNavigate();

  /* ────────── Estado ────────── */
  const [form, setForm]   = useState({
    nombre: '', apellidos: '', correo: '', telefono: '',
    username: '', password: '', confirm: '',
  });
  const [err , setErr ]   = useState({});
  const [touch,setTouch ] = useState({});
  const [sub , setSub ]   = useState(false);
  const [msg , setMsg ]   = useState(null);

  const onChange = f => e => setForm({ ...form, [f]: e.target.value });
  const onBlur   = f => () => setTouch({ ...touch, [f]: true });

  /* ─── Validación reactiva ─── */
  useMemo(() => {
    const e = {};
    if (!form.nombre.trim())            e.nombre    = 'Requerido';
    if (!form.apellidos.trim())         e.apellidos = 'Requerido';
    if (!emailRx.test(form.correo))     e.correo    = 'Correo inválido';
    if (!phoneRx.test(form.telefono))   e.telefono  = '7-15 dígitos';
    if (!userRx.test(form.username))    e.username  = '3-20 letras/números/_';
    if (form.password.length < 6)       e.password  = 'Mínimo 6 caracteres';
    if (form.confirm !== form.password) e.confirm   = 'No coincide';
    setErr(e);
  }, [form]);

  const show = f => (sub || touch[f]) && err[f];
  const bind = f => ({
    value: form[f],
    onChange: onChange(f),
    onBlur: onBlur(f),
    error: !!show(f),
    helperText: show(f) || ' ',
  });

  /* ────────── Envío ────────── */
  const submit = async ev => {
    ev.preventDefault();
    setSub(true);
    if (Object.keys(err).length) return;

    try {
      /* 1. Registro del conductor */
      const { data } = await axiosPublic.post('/auth/register/conductor', {
        nombre   : form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo   : form.correo.trim(),
        password : form.password,
        telefono : form.telefono.trim(),
        username : form.username.trim(),
      });

      /* 2. Login inmediato para obtener token */
      const { data: login } = await axiosPublic.post('/auth/login', {
        correo: form.correo.trim(),
        password: form.password,
      });

      localStorage.setItem('authToken', login.token);
      localStorage.setItem('userRole',  login.role);
      localStorage.setItem('driverId',  data.id);          // id de tabla conductor

      /* 3. Adelante al registro del vehículo */
      nav('/register-vehicle', { replace: true });
    } catch (e) {
      console.error(e);
      setMsg('Error al registrar');
    }
  };

  return (
    <AuthLayout title="Empecemos">
      <FormCard component="form" onSubmit={submit}>
        <Stack spacing={3}>
          {[
            ['Nombre completo'           , 'nombre'  ],
            ['Apellidos'                 , 'apellidos'],
            ['Email'                     , 'correo'  , 'email'  ],
            ['Número de teléfono'        , 'telefono', 'tel'    ],
            ['Nombre de usuario'         , 'username'],
            ['Contraseña'                , 'password', 'password'],
            ['Confirmar contraseña'      , 'confirm' , 'password'],
          ].map(([lbl, key, type = 'text']) => (
            <Box key={key}>
              <Typography className="rd-label">{lbl}</Typography>
              <AuthTextField type={type} {...bind(key)} />
            </Box>
          ))}

          {msg && <Typography color="secondary.light">{msg}</Typography>}

          <PrimaryButton type="submit">Continuar</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
