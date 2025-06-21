import React from 'react';
import { Box, Container } from '@mui/material';
import MainNavbar from "../navigation/MainNavbar";   // ⬅️ la barra que ya gestiona menús y avatar

/**
 * Envoltorio principal para TODAS las pantallas privadas.
 *  - Muestra un único <MainNavbar/> (evitamos barras duplicadas)
 *  - Pinta el fondo azul clarito
 *  - Centra el contenido dentro de <Container/>
 */
export default function MainLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'primary.light' }}>
      <MainNavbar />

      {/* Área de contenido */}
      <Container sx={{ py: 6 }}>
        {children}
      </Container>
    </Box>
  );
}
