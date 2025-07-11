import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Background = styled('main')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.primary.light,
  display: 'flex',
  flexDirection: 'column',
}));

export default function AuthLayout({ title, children }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Background>
      <AppBar position="static" color="primary" sx={{ py: 1 }}>
        <Toolbar>
          <Box 
            onClick={handleGoHome}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <ArrowBackIosNewIcon sx={{ mr: 1 }} />
            <Typography variant="h6">INTER<strong>RIDE</strong></Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 6 }}>
        {title && (
          <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Container>
    </Background>
  );
}