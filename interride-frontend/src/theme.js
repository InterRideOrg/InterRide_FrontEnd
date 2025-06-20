// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  /* ---------- PALETA DE COLORES ---------- */
  palette: {
    mode: 'light',
    primary: {
      main: '#325B6B',     // azul-petrol
      light: '#E3F2FD',    // bg claro (mock-up)
      dark:  '#264653',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#80BEC5',
      light: '#A7D4D9',
      dark:  '#4F7780',
      contrastText: '#FFFFFF',
    },
  },

  /* ---------- TIPOGRAFÍAS ---------- */
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: 60, fontWeight: 700 },
    h2: { fontSize: 48, fontWeight: 700 },
    h3: { fontSize: 36, fontWeight: 700 },
    body1: { fontSize: 24 },
    body2: { fontSize: 17 },
    caption: { fontSize: 12 },
  },

  /* ---------- RADIO GLOBAL ---------- */
  // ⬅ NUEVO: todos los componentes heredan 12 px
  shape: {
    borderRadius: 12,
  },

  /* ---------- SOBRECARGAS DE COMPONENTES ---------- */
  components: {
    /* TextField / OutlinedInput redondeados
       (sobrescribe lo global en caso de que se cambie en otro lugar) */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        input: {
          padding: '14px',           // mismo padding que MUI default ‘lg’
        },
      },
    },
  },
});
