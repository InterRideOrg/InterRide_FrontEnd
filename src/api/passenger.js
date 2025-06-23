// src/api/passenger.js
/** Mock temporal usado mientras el backend/gráfica real no está lista. */
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
  