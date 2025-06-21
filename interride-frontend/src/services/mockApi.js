// src/services/mockApi.js
/**
 * Mock provisional para la Home del pasajero.
 * Devuelve la data en la misma forma que la que llegará
 * desde tu Spring-Boot una vez tengas el endpoint real.
 */
export function fetchPassengerHome() {
    return Promise.resolve({
      current: {
        id: 1,
        destination: 'Yauyos',
        driver: 'Pedro Rojas'
      },
      available: [
        { id: 2, destination: 'Huaral',   seats: 3 },
        { id: 3, destination: 'Barranca', seats: 1 }
      ]
    });
  }
