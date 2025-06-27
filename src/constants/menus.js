// src/constants/menus.js
const userId = localStorage.getItem('userId');
export default {
    PASSENGER: [
      { label: "Inicio",              path: `/passenger/home/${userId}`},
      { label: "Historial de viajes", path: "/passenger/history"     },
      { label: "Pagos",               path: "/payments"    },
      { label: "Ayuda",               path: `/helpPassenger/${userId}`},
      { label: "Notificaciones",      path: "/notifications"},
      { label: "Perfil",              path: `/passenger/profile/${userId}`     }   // 👈 NUEVO
    ],
  
    DRIVER: [
      { label: "Inicio",              path: `/driver/home/${userId}`},
      { label: "Viajes completados",  path: `/driver/history/${userId}` },
      { label: "Billetera",           path: "/wallet"      },
      { label: "Ayuda",               path: `/helpDriver/${userId}`        },
      { label: "Notificaciones",      path: "/notifications"},
      { label: "Perfil",              path: `/driver/profile/${userId}`}   // 👈 NUEVO
    ]
  };
  