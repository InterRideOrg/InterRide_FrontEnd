// src/api/trips.js
import axios from './client';

// GET /api/trips/home – regresa { current: {...}, available:[...] }
export function fetchPassengerHome() {
  return axios.get('/trips/home/passenger').then(r => r.data);
}
