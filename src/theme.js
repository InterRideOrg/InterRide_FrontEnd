// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#325B6B',   // brand primary
      light: '#E3F2FD',  // fondos claros
      dark:  '#264653',  // azul card
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#80BEC5',   // gris azulado guía
    },
    /* 🔵 Color de error sobrescrito */
    error: {
      main:  '#80BEC5',   // azul claro
      light: '#B0D9DE',
      dark:  '#4f7c82',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: 60, fontWeight: 600 },
    h2: { fontSize: 48, fontWeight: 600 },
    h3: { fontSize: 36, fontWeight: 600 },
    body1: { fontSize: 24 },
    body2: { fontSize: 17 },
    caption: { fontSize: 12 },
  },

  // ⬇️  aquí están los cambios
  shape: {
    borderRadius: 20,                 // ← radio por defecto creciente
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // siempre fondo blanco
          borderRadius: 20,           // radio extra redondeado en inputs
          '& fieldset': {
            borderRadius: 20,
          },
          // hover & focus
          '&:hover fieldset': {
            borderColor: '#607D8B33', // sutil
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2,
            borderColor: '#39A6AC',   // color hover guía
          },
        },
        input: {
          padding: '14px 20px',       // un poco más de aire
        },
      },
    },
    /* 👉 color del helper-text en error */
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: '#80BEC5',
          },
        },
      },
    },

    /* 👉 color del label en error */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: '#80BEC5',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,         // píldora
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
