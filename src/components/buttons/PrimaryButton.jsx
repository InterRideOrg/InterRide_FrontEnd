import React from 'react';
import { Button } from '@mui/material';

export default function PrimaryButton({ children, ...rest }) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{ borderRadius: 9999, width: 200, alignSelf: 'center' }}
      {...rest}
    >
      {children}
    </Button>
  );
}
