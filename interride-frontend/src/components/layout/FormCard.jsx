import React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  width: '100%',
  maxWidth: 540,
  marginInline: 'auto',
}));

export default function FormCard(props) {
  return <StyledPaper component="form" noValidate {...props} />;
}
