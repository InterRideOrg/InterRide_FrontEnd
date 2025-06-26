import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import AuthTextField from '../../components/inputs/AuthTextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';

import './styles/RegisterDriver.css';

export default function RegisterDriverPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', correo: '', telefono: '', password: '', confirm: ''
  });
  const handle = f => e => setForm({ ...form, [f]: e.target.value });

  const next = e => {
    e.preventDefault();
    localStorage.setItem('driverDraft', JSON.stringify(form));
    navigate('/register-vehicle');
  };

  return (
    <AuthLayout title="Empecemos">
      <FormCard onSubmit={next}>
        <Stack spacing={3}>
          {[
            ['Nombre completo', 'nombre'],
            ['Email', 'correo', 'email'],
            ['Número de teléfono', 'telefono', 'tel'],
            ['Contraseña', 'password', 'password'],
            ['Confirmar contraseña', 'confirm', 'password']
          ].map(([lbl, fld, type = 'text']) => (
            <Box key={fld}>
              <Typography className="rd-label">{lbl}</Typography>
              <AuthTextField type={type} value={form[fld]} onChange={handle(fld)} />
            </Box>
          ))}
          <PrimaryButton>Continuar</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
