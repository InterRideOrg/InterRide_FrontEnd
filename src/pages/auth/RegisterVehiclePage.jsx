import { useEffect, useState, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AuthLayout      from '../../components/layout/AuthLayout';
import FormCard        from '../../components/ui/FormCard';
import AuthTextField   from '../../components/inputs/AuthTextField';
import PrimaryButton   from '../../components/buttons/PrimaryButton';

import axiosProtected  from '../../interceptors/axiosInstance';   /* ⇦ con token */

import './styles/RegisterVehicle.css';     /* prefijo rv- */

const plateRx = /^[A-Za-z0-9]{5,8}$/;

export default function RegisterVehiclePage() {
  const nav = useNavigate();

  const driverId = localStorage.getItem('driverId');   /* creado en registro */

  /* ---------- formulario ---------- */
  const [veh, setVeh]  = useState({
    placa:'', marca:'', modelo:'', anio:'', capacidad:'',
  });
  const [err , setErr ] = useState({});
  const [touch,setTouch] = useState({});
  const [sub , setSub ]  = useState(false);
  const [msg , setMsg ]  = useState(null);

  const onChange = f => e => setVeh({ ...veh, [f]: e.target.value });
  const onBlur   = f => () => setTouch({ ...touch, [f]: true });

  /* ---------- validación ---------- */
  useMemo(() => {
    const e = {};
    if (!plateRx.test(veh.placa)) e.placa = '5-8 letras/números';
    ['marca','modelo'].forEach(k => { if (!veh[k].trim()) e[k]='Requerido'; });
    if (!/^\d{4}$/.test(veh.anio))            e.anio      = 'Año (4 dígitos)';
    if (!/^\d+$/.test(veh.capacidad) || +veh.capacidad < 1)
                                             e.capacidad = 'Número válido';
    setErr(e);
  }, [veh]);

  const show = f => (sub || touch[f]) && err[f];
  const bind = f => ({
    value: veh[f],
    onChange: onChange(f),
    onBlur: onBlur(f),
    error: !!show(f),
    helperText: show(f) || ' ',
  });

  /* ---------- envío ---------- */
  const submit = async ev => {
    ev.preventDefault();
    setSub(true);
    if (!driverId || Object.keys(err).length) return;

    try {
      await axiosProtected.post(
        `/vehiculo/registrar/${driverId}`,
        {
          placa            : veh.placa.trim().toUpperCase(),
          marca            : veh.marca.trim().toUpperCase(),
          modelo           : veh.modelo.trim().toUpperCase(),
          anio             : +veh.anio,
          cantidadAsientos : +veh.capacidad,
        }
      );

      /* ✔ finalizado */
      localStorage.removeItem('driverId');
      nav('/login', { replace:true });
    } catch (e) {
      console.error(e);
      setMsg('Error al registrar vehículo');
    }
  };

  /* si no hay driverId (refresh) volvemos */
  useEffect(() => {
    if (!driverId) nav('/register-driver', { replace:true });
  }, [driverId, nav]);

  return (
    <AuthLayout title="Datos De Tu Vehículo">
      <FormCard component="form" onSubmit={submit}>
        <Stack spacing={3}>
          {[
            ['Placa'                       , 'placa'    ],
            ['Marca'                       , 'marca'    ],
            ['Modelo'                      , 'modelo'   ],
            ['Año'                         , 'anio'     , 'number'],
            ['Cantidad máxima de pasajeros', 'capacidad', 'number'],
          ].map(([lbl, key, type='text']) => (
            <Box key={key}>
              <Typography className="rv-label">{lbl}</Typography>
              <AuthTextField type={type} {...bind(key)} />
            </Box>
          ))}

          {msg && <Typography color="secondary.light">{msg}</Typography>}

          <PrimaryButton type="submit">Registrarse</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
