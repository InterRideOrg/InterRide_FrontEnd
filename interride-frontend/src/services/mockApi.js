// src/services/mockApi.js
/**
 * Mocks provisionales mientras el backend REST aún no está
 * listo.  Mantienen la misma forma de los JSON reales para
 * que luego solo cambies la URL de fetch().
 */

/* HOME – pasajero -------------------------------------------------------- */
export function fetchPassengerHome() {
    return Promise.resolve({
      current: {
        id: 1,
        destination: "Yauyos",
        driver: "Pedro Rojas",
      },
      available: [
        { id: 2, destination: "Huaral", seats: 3 },
        { id: 3, destination: "Barranca", seats: 1 },
      ],
    });
  }
  
  /* PERFIL – pasajero ------------------------------------------------------ */
  export function fetchPassengerProfile() {
    // ⚠️ estructura 1 :1 con     GET /pasajero/{id}
    return Promise.resolve({
      id: 42,
      nombres: "Luis",
      apellidos: "Grace",
      correo: "example@example.com",
      telefono: "987654321",
    });
  }
  

  export async function requestTrip(payload) {
    console.log("🛫 Mock -> requestTrip", payload);
    // Simula latencia 
    return new Promise((res) => setTimeout(res, 600));
  }
  