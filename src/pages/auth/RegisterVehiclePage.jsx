import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import AuthTextField from '../../components/inputs/AuthTextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import axiosInstancePublic from "../../interceptors/axiosInstancePublic";

import './styles/RegisterVehicle.css';

export default function RegisterVehiclePage() {
  const [owner, setOwner]   = useState(null);
  const [vehicle, setVehicle] = useState({
    placa: '', marca: '', modelo: '', anio: '', capacidad: ''
  });
  useEffect(() => {
    setOwner(JSON.parse(localStorage.getItem('driverDraft') || 'null'));
  }, []);

  const handle = f => e => setVehicle({ ...vehicle, [f]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    const payload = { ...owner, ...vehicle };
    await axiosInstancePublic.post('/auth/register-driver', payload);
    localStorage.removeItem('driverDraft');
    /* TODO: redirigir al login */
  };

  return (
    <AuthLayout title="Datos de tu vehículo">
      <FormCard onSubmit={submit}>
        <Stack spacing={3}>
          {[
            ['Placa', 'placa'],
            ['Marca', 'marca'],
            ['Modelo', 'modelo'],
            ['Año', 'anio', 'number'],
            ['Cantidad máxima de pasajeros', 'capacidad', 'number']
          ].map(([lbl, fld, type = 'text']) => (
            <Box key={fld}>
              <Typography className="rv-label">{lbl}</Typography>
              <AuthTextField type={type} value={vehicle[fld]} onChange={handle(fld)} />
            </Box>
          ))}
          <PrimaryButton>Registrarse</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
