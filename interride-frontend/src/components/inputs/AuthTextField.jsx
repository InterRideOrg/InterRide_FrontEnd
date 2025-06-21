import React from 'react';
import { TextField } from '@mui/material';

export default function AuthTextField(props) {
  return (
    <TextField
      fullWidth
      required
      InputProps={{ sx: { backgroundColor: 'common.white' } }}
      {...props}
    />
  );
}
