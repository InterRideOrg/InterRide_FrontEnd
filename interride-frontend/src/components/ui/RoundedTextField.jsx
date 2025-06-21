import React from 'react';
import { TextField } from '@mui/material';

/**
 * TextField con fondo blanco y bordes redondeados.
 * Se usa en Login, Register, ForgotPassword, etc.
 */
export default function RoundedTextField(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        sx: { backgroundColor: 'common.white', borderRadius: 4 },
      }}
      {...props}
    />
  );
}
