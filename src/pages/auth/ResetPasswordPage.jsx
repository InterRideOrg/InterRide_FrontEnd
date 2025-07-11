import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormCard from '../../components/ui/FormCard';
import RoundedTextField from '../../components/ui/RoundedTextField';
import axiosPublic from '../../interceptors/axiosInstancePublic';

export default function ResetPasswordPage() {
  const { token }   = useParams();
  const navigate    = useNavigate();

  /* estado */
  const [checking,  setChecking]  = useState(true);
  const [valid,     setValid]     = useState(false);
  const [pwd1,      setPwd1]      = useState('');
  const [pwd2,      setPwd2]      = useState('');
  const [saving,    setSaving]    = useState(false);
  const [errorMsg,  setError]     = useState(null);
  const [success,   setSuccess]   = useState(false);

  /* ───── verificar token ───── */
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosPublic.get(`/mail/reset/check/${token}`);
        setValid(data === true);
      } catch (err) {
        console.error(err);
        setValid(false);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [token]);

  /* ───── enviar nueva contraseña ───── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (pwd1 !== pwd2)      { setError('Las contraseñas no coinciden'); return; }
    if (pwd1.length < 6)    { setError('Mínimo 6 caracteres');         return; }

    try {
      setSaving(true);

      /** endpoint real => /mail/reset/{token} */
      await axiosPublic.post(
        `/mail/reset/${token}`,
        pwd1,
        { headers: { 'Content-Type': 'text/plain' } }
      );

      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      console.error(err);
      setError('No se pudo restablecer la contraseña');
    } finally {
      setSaving(false);
    }
  };

  /* ───── vistas de estado ───── */
  if (checking) {
    return (
      <AuthLayout title="Validando enlace…">
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      </AuthLayout>
    );
  }

  if (!valid) {
    return (
      <AuthLayout title="Enlace inválido">
        <Alert severity="error">El enlace de restablecimiento no es válido o ha expirado.</Alert>
      </AuthLayout>
    );
  }

  /* ───── formulario ───── */
  return (
    <AuthLayout title="Nueva contraseña">
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          ¡Contraseña cambiada! Redirigiendo al inicio de sesión…
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormCard sx={{ maxWidth: 480, mx: 'auto' }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle1" color="common.white" gutterBottom>
                Contraseña
              </Typography>
              <RoundedTextField
                type="password"
                required
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" color="common.white" gutterBottom>
                Confirmar contraseña
              </Typography>
              <RoundedTextField
                type="password"
                required
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />
            </Box>
          </Stack>
        </FormCard>

        <Box textAlign="center" mt={4}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            endIcon={saving && <CircularProgress size={18} />}
          >
            {saving ? 'Guardando…' : 'Continuar'}
          </Button>
        </Box>
      </form>
    </AuthLayout>
  );
}
