import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import RoundedTextField from '../../components/ui/RoundedTextField';
import axiosPublic from '../../interceptors/axiosInstancePublic';

export default function ForgotPasswordPage() {
  const [email,    setEmail]   = useState('');
  const [sending,  setSending] = useState(false);
  const [success,  setSuccess] = useState(false);
  const [errorMsg, setError]   = useState(null);

  /* ───── submit ───── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSending(true);

      /** endpoint real => /mail/sendMail */
      await axiosPublic.post(
        '/mail/sendMail',
        email.trim(),
        { headers: { 'Content-Type': 'text/plain' } }
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar el correo. Intenta nuevamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout title="¿Olvidaste tu contraseña?">
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 6 }}>
        Ingresa el e-mail con el que te registraste; recibirás un enlace para
        restablecer tu contraseña.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 4 }}>¡Correo enviado!</Alert>}
      {errorMsg && <Alert severity="error"   sx={{ mb: 4 }}>{errorMsg}</Alert>}

      <FormCard component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" color="common.white" mb={1}>
              Correo electrónico
            </Typography>
            <RoundedTextField
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@email.com"
            />
          </Box>
        </Stack>
      </FormCard>

      <Box textAlign="center" mt={6}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={sending}
          endIcon={sending && <CircularProgress size={18} />}
          sx={{ width: 200, borderRadius: 9999 }}
        >
          {sending ? 'Enviando…' : 'Continuar'}
        </Button>
      </Box>
    </AuthLayout>
  );
}
