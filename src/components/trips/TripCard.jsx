import React from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/system';

const CardRoot = styled(Box)(({ theme, $highlight }) => ({
  backgroundColor: $highlight ? theme.palette.secondary.main : theme.palette.primary.dark,
  color: theme.palette.common.white,
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': { opacity: .9 }
}));

export default function TripCard({ title, subtitle, highlight, onClick }) {
  return (
    <CardRoot $highlight={highlight} onClick={onClick}>
      <Stack spacing={.5}>
        <Typography variant="subtitle1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: .8 }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
      <IconButton sx={{ color: 'white' }} size="small">
        <ArrowForwardIosIcon fontSize="inherit" />
      </IconButton>
    </CardRoot>
  );
}
