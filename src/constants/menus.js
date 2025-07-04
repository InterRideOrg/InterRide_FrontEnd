// src/constants/menus.js
import { useAuth }   from "../auth/AuthContext";
import { useQuery }  from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInstance";

export default function useMenus() {
  const { user } = useAuth();
  const userId   = user?.userId;

  /* Obtener id de pasajero solo si el rol es PASAJERO */
  const { data: passengerId } = useQuery({
    enabled : !!userId && user?.role === "PASAJERO",
    queryKey: ["passengerId", userId],
    queryFn : () =>
      axiosInstance
        .get(`/usuario/profile/PassengerId/${userId}`)
        .then(r => r.data),
    staleTime: 5 * 60_000,
  });

  /* Enlaces comunes por rol */
  if (user?.role === "PASAJERO") {
    return [
      { label: "Inicio",              path: `/passenger/home/${userId}` },
      { label: "Historial de viajes", path: `/passenger/history/${passengerId}`},
      { label: "Pagos",               path: `/passenger/payments/${passengerId}` },
      { label: "Ayuda",               path: `/helpPassenger/${userId}` },
      { label: "Notificaciones",      path: "/passenger/notifications" }
//      { label: "Perfil",              path: `/passenger/profile/${userId}` },
    ];
  }

  if (user?.role === "CONDUCTOR") {
    return [
      { label: "Inicio",              path: `/driver/home/${userId}` },
      { label: "Viajes completados",  path: `/driver/history/${userId}` },
      { label: "Billetera",           path: "/wallet" },
      { label: "Ayuda",               path: `/helpDriver/${userId}` },
      { label: "Notificaciones",      path: "/driver/notifications" }
//      { label: "Perfil",              path: `/driver/profile/${userId}` },
    ];
  }

  /* Sin sesión → array vacío (el navbar mostrará los links del landing) */
  return [];
}
