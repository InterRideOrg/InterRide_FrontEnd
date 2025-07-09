import axios from 'axios';

/**
 * Cliente SIN autenticación.
 * Se usa para /auth/login, /auth/register, /public/… etc.
 */
const axiosInstancePublic = axios.create({
  
  //baseURL: 'http://localhost:8081/api/v1',
  baseURL: 'https://interride-api-latest.onrender.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

/* Sólo gestionamos errores 4xx/5xx genéricos */
axiosInstancePublic.interceptors.response.use(
  res   => res,
  err   => Promise.reject(err),
);

export default axiosInstancePublic;
