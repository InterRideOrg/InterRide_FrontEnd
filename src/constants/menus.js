// src/constants/menus.js
const userId = localStorage.getItem('userId');
export default {
    PASSENGER: [
      { label: "Inicio",              path: `/passenger/home/${userId}`},
      { label: "Historial de viajes", path: "/passenger/history"     },
      { label: "Pagos",               path: "/payments"    },
      { label: "Ayuda",               path: "/help"        },
      { label: "Notificaciones",      path: "/notifications"},
      { label: "Perfil",              path: "/profile"     }   // 👈 NUEVO
    ],
  
    DRIVER: [
      { label: "Inicio",              path: "/home"        },
      { label: "Billetera",           path: "/wallet"      },
      { label: "Ayuda",               path: "/help"        },
      { label: "Notificaciones",      path: "/notifications"},
      { label: "Perfil",              path: "/profile"     }   // 👈 NUEVO
    ]
  };
  