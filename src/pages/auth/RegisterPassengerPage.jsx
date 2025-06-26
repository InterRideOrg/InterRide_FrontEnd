import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import AuthTextField from '../../components/inputs/AuthTextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import axiosInstancePublic from "../../interceptors/axiosInstancePublic";

import './styles/RegisterPassenger.css';   //  ➜ sin prefijo

export default function RegisterPassengerPage() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
    confirm: ''
  });
  const handle = field => e => setForm({ ...form, [field]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    /** Enviar con instancia pública */
    await axiosInstancePublic.post('/auth/register-passenger', form);
    /* TODO: mostrar toast / redirigir */
  };

  return (
    <AuthLayout title="Empecemos">
      <FormCard onSubmit={submit}>
        <Stack spacing={3}>
          {[
            ['Nombre completo', 'nombre'],
            ['Email', 'correo', 'email'],
            ['Número de teléfono', 'telefono', 'tel'],
            ['Contraseña', 'password', 'password'],
            ['Confirmar contraseña', 'confirm', 'password']
          ].map(([label, field, type = 'text']) => (
            <Box key={field}>
              <Typography className="rp-label">{label}</Typography>
              <AuthTextField
                type={type}
                value={form[field]}
                onChange={handle(field)}
              />
            </Box>
          ))}
          <PrimaryButton>Registrarse</PrimaryButton>
        </Stack>
      </FormCard>
    </AuthLayout>
  );
}
