import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import dayjs from "dayjs";
import MainNavbar from "../../components/navigation/MainNavbar";
import OnlyViewMap from "../../components/maps/OnlyViewMap";
import "./styles/AbordTripPage.css";

const AbordTripPage = () => {
  const [trip, setTrip] = useState(null);
  const [pasajeroId, setPasajeroId] = useState(null);
  const [canAbordar, setCanAbordar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPassengerId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axiosInstance.get(`/usuario/profile/PassengerId/${userId}`);
        setPasajeroId(response.data);
      } catch (error) {
        console.error("Error fetching passenger ID:", error);
      }
    };
    fetchPassengerId();
  }, []);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!pasajeroId) return;
      try {
        const response = await axiosInstance.get(`/trips/viajeAceptado/${pasajeroId}`);
        setTrip(response.data);

        const tripTime = dayjs(response.data.fecha_hora_partida);
        const now = dayjs();
        const isWithinMargin = now.isAfter(tripTime.subtract(30, "minute")) && now.isBefore(tripTime.add(30, "minute"));
        setCanAbordar(isWithinMargin);
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };
    fetchTripDetails();
  }, [pasajeroId]);

  const handleAbordar = async () => {
    try {
      await axiosInstance.put(`/boletos/${pasajeroId}/${trip.id}/abordar`);
      alert("¡Has abordado el viaje exitosamente!");
      navigate("/passenger/home");
    } catch (error) {
      console.error("Error al abordar el viaje:", error);
      alert("No se pudo abordar el viaje. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="abord-trip-container">
        <div className="abord-trip-title">
          <h1>Tu viaje aceptado</h1>
        </div>

        <div className="abord-trip-content">
          <div className="abord-trip-info">
            {trip ? (
              <>
                <div className="abord-trip-section">
                  <h4>Conductor</h4>
                  <p>{trip.nombreConductor} {trip.apellidoConductor}</p>
                </div>
                <div className="abord-trip-section">
                  <h4>Vehículo</h4>
                  <p>{trip.marcaVehiculo} {trip.modeloVehiculo} - {trip.placaVehiculo}</p>
                </div>
                <div className="abord-trip-section">
                  <h4>Origen</h4>
                  <p>{trip.origenProvincia}</p>
                </div>
                <div className="abord-trip-section">
                  <h4>Destino</h4>
                  <p>{trip.destinoProvincia}</p>
                </div>
                <div className="abord-trip-section">
                  <h4>Fecha y Hora de partida</h4>
                  <p>{dayjs(trip.fecha_hora_partida).format("YYYY-MM-DD HH:mm")}</p>
                </div>
              </>
            ) : (
              <p>Cargando información del viaje...</p>
            )}

            {canAbordar && (
              <div className="abord-trip-button">
                <button onClick={handleAbordar}>¡Estoy a bordo!</button>
              </div>
            )}
          </div>

          <div className="abord-trip-map">
            {trip ? (
              <OnlyViewMap
                initialOrigin={`${trip.origenProvincia}`}
                initialDestination={`${trip.destinoProvincia}`}
                originCoords={{ lat: trip.origenLatitud, lng: trip.origenLongitud }}
                destinationCoords={{ lat: trip.destinoLatitud, lng: trip.destinoLongitud }}
              />
            ) : (
              <p>Cargando mapa...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AbordTripPage;
