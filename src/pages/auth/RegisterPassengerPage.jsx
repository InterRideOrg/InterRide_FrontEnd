import { useState, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AuthLayout          from '../../components/layout/AuthLayout';
import FormCard            from '../../components/ui/FormCard';
import AuthTextField       from '../../components/inputs/AuthTextField';
import PrimaryButton       from '../../components/buttons/PrimaryButton';
import axiosInstancePublic from '../../interceptors/axiosInstancePublic';
import { useNavigate } from 'react-router-dom';

import './styles/RegisterPassenger.css';     // recuerda el prefijo rp- en las clases

/* ────── expresiones regulares ────── */
const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRx  = /^\d{7,15}$/;
const userRx   = /^[a-zA-Z0-9_]{3,20}$/;

export default function RegisterPassengerPage() {

   const navigate = useNavigate();
  /* ────── estado ────── */
  const [form, setForm]  = useState({
    nombre    : '',
    apellidos : '',
    correo    : '',
    telefono  : '',
    username  : '',
    password  : '',
    confirm   : '',
  });
  const [errors,   setErr]  = useState({});
  const [touched,  setT  ]  = useState({});
  const [submitted,setSub]  = useState(false);
  const [msg,      setMsg]  = useState(null);

  /* ────── manejadores de input ────── */
  const handle     = f => e => setForm({ ...form, [f]: e.target.value });
  const markBlur   = f => () => setT ({ ...touched, [f]: true });

  /* ────── validación reactiva ────── */
  useMemo(() => {
    const e = {};
    if (!form.nombre.trim())         e.nombre    = 'Requerido';
    if (!form.apellidos.trim())      e.apellidos = 'Requerido';
    if (!emailRx.test(form.correo))  e.correo    = 'Correo inválido';
    if (!phoneRx.test(form.telefono))e.telefono  = 'Sólo dígitos (7-15)';
    if (!userRx.test(form.username)) e.username  = '3-20 letras, números o _';
    if (form.password.length < 6)    e.password  = 'Mínimo 6 caracteres';
    if (form.confirm !== form.password) e.confirm = 'No coincide';
    setErr(e);
  }, [form]);

  /* ────── envío ────── */
  const submit = async ev => {
    ev.preventDefault();
    setSub(true);
    if (Object.keys(errors).length) return;      // aún hay errores

    try {
      await axiosInstancePublic.post('/auth/register/pasajero', {
        nombre   : form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo   : form.correo.trim(),
        password : form.password,
        telefono : form.telefono.trim(),
        username : form.username.trim(),
      });
      setMsg('¡Registro exitoso!');
      navigate('/login');
    } catch (e) {
      console.error(e);
      setMsg('Error al registrar');
    }
  };

  /* ────── helpers de UI ────── */
  const showErr = f => (submitted || touched[f]) && errors[f];
  const bind    = f => ({
    value       : form[f],
    onChange    : handle(f),
    onBlur      : markBlur(f),
    error       : !!showErr(f),
    helperText  : showErr(f) || ' ',
  });

  return (
    <AuthLayout title="Empecemos">
      <FormCard component="form" onSubmit={submit}>
        <Stack spacing={0}>

          {/* campos */}
          {[
            ['Nombres',          'nombre'   ],
            ['Apellidos',                'apellidos'],
            ['Email',                    'correo',   'email'],
            ['Número de teléfono',       'telefono', 'tel'  ],
            ['Nombre de usuario',        'username' ],
            ['Contraseña',               'password', 'password'],
            ['Confirmar contraseña',     'confirm',  'password'],
          ].map(([label, field, type = 'text']) => (
            <Box key={field}>
              <Typography
                className="rp-label"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {label}
              </Typography>
              <AuthTextField
                type={type}
                {...bind(field)}
                size="small"
              />
            </Box>
          ))}

          {/* mensaje resultado */}
          {msg && (
            <Typography 
              color="secondary.light" 
              align="center"
              variant="body2"  // Texto más pequeño
            >
              {msg}
            </Typography>
          )}

          <PrimaryButton type="submit">Registrarse</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
