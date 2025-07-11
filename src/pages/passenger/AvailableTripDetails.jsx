import { useParams, useNavigate } from "react-router-dom";
import MainNavbar from "../../components/navigation/MainNavbar";
import { useState, useEffect, useRef, useCallback} from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

import './styles/AvailableTripDetails.css';

dayjs.locale('es');

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = {
  lat: -12.0464,
  lng: -77.0428,
};

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const AvailableTripDetails = () => {
  const { viajeId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [trip, setTrip] = useState(null);
  const [driver, setDriver] = useState(null);
  const [pasajeroId, setPasajeroId] = useState(null);
  const [asientos, setAsientos] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [origenCoords, setOrigenCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [car, setCar] = useState(null);
  const [totalAsientosOcupados, setTotalAsientosOcupados] = useState(0);

  const [destino, setDestino] = useState({
    direccion: "",
    provincia: "",
    latitud: defaultCenter.lat,
    longitud: defaultCenter.lng,
  });

  const autocompleteRef = useRef(null);
  const LIBRARIES = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/boletos/viaje/${viajeId}`)
      .then(async res => {
        const boletos = res.data;
        if (boletos.length > 0) {
          
          const viaje = boletos[0];
          setTrip(viaje);

          const totalAsientos = boletos.reduce((total, boleto) => {
            return total + (boleto.asientosOcupados || 0);
          }, 0);

          setTotalAsientosOcupados(totalAsientos);

          const direccionCompleta = `${viaje.direccionPartida}`;

          console.log("Geocodificando origen del viaje:", direccionCompleta);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: direccionCompleta }, (results, status) => {
            if (status === "OK" && results[0]) {
              const loc = results[0].geometry.location;
              setOrigenCoords({ lat: loc.lat(), lng: loc.lng() });
            } else {
              console.warn("No se pudo geocodificar el origen del viaje:", status);
            }
          });

          axiosInstance.get(`/usuario/profile/conductor/${viaje.conductorId}`)
            .then(res => {
              setDriver(res.data);
              setLoading(false);
            })
            .catch(err => {
              console.error(err);
              setLoading(false);
            });
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [viajeId]);

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/usuario/profile/PassengerId/${userId}`)
        .then((res) => {
          const id = Number(res.data);
          if (!isNaN(id)) setPasajeroId(id);
        })
        .catch((err) => console.error("Error obteniendo pasajeroId:", err));
    }
  }, [userId]);

  useEffect(() => {
    if (trip) {
      axiosInstance.get(`/vehiculo/${trip.conductorId}`)
        .then(res => {
          setCar(res.data);
        })
        .catch(err => console.error("Error obteniendo vehículo:", err));
    }
  }, [trip]);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setDestino(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
  }, []);

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let provincia = "";
    const components = place.address_components || [];
    for (const c of components) {
      if (c.types.includes("administrative_area_level_1") || c.types.includes("administrative_area_level_2")) {
        provincia = c.long_name;
        break;
      }
    }

    setDestino(prev => ({
      ...prev,
      direccion: place.formatted_address || prev.direccion,
      latitud: lat,
      longitud: lng,
      provincia: provincia,
    }));
  };

  const handleReserva = async () => {
    if (!pasajeroId || !destino.direccion || !destino.provincia) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    if (!origenCoords) {
      setMensaje("No se pudo obtener la ubicación del origen del viaje.");
      return;
    }

    const distancia = calcularDistanciaKm(
      origenCoords.lat,
      origenCoords.lng,
      destino.latitud,
      destino.longitud
    );

    if (distancia > 10) {
      setMensaje("Tu ubicación está demasiado lejos del origen del viaje.");
      return;
    }

    setReserving(true);
    setMensaje("Procesando reserva...");

    try {
      const body = {
        direccion: destino.direccion,
        provincia: destino.provincia,
        latitud: destino.latitud,
        longitud: destino.longitud,
      };

      await axiosInstance.post(
        `/boletos/union/${pasajeroId}/${viajeId}?asientosOcupados=${asientos}`,
        body
      );

      setMensaje("¡Reserva exitosa! Redirigiendo...");
      setTimeout(() => {
        navigate(`/passenger/home/${userId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMensaje("Error: "+  err.response?.data?.detail || "Error al procesar la reserva. Inténtalo de nuevo.");
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <section className="available-trip-details-sec">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Cargando detalles del viaje...</h2>
            <p>Por favor espera un momento</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <section className="available-trip-details-sec">
        {/* Header mejorado */}
        <div className="available-trip-details-header">
          <div className="header-content">
            <h1>¡Tu Próxima Aventura Te Espera!</h1>
          </div>
        </div>

        <div className="available-trip-details-content">
          {/* Información del viaje mejorada */}
          <div className="available-trip-details-info">
            <div className="available-trip-details-info-header">
              <h3>📋 Información del Viaje</h3>
            </div>
            
            <div className="available-trip-details-info-body">
              {/* Conductor */}
              <div className="info-item driver-info">
                <div className="info-icon">👨‍✈️</div>
                <div className="info-content">
                  <h5>TU CONDUCTOR</h5>
                  <p>{driver ? `${driver.nombre} ${driver.apellidos}` : "Cargando..."}</p>
                  <div className="driver-rating">
                    <span className="verified">✓ Verificado</span>
                  </div>
                </div>
              </div>

              <div className="info-divider"></div>

              {/* Fecha y Hora */}
              <div className="info-item">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <h5>FECHA DE PARTIDA</h5>
                  <p>{trip ? dayjs(trip.fechaHoraPartida).format("dddd, DD [de] MMMM [de] YYYY") : "Cargando..."}</p>
                  <div className="time-info">
                    <span className="time">🕐 {trip ? dayjs(trip.fechaHoraPartida).format("HH:mm [hrs]") : ""}</span>
                  </div>
                </div>
              </div>

              <div className="info-divider"></div>

              {/* Ruta */}
              <div className="route-section">
                <h5>🗺️ RUTA DEL VIAJE</h5>
                
                <div className="route-container">
                  <div className="route-item origin">
                    <div className="route-dot origin-dot"></div>
                    <div className="route-info">
                      <span className="route-type">ORIGEN</span>
                      <h6>{trip ? trip.provinciaOrigen : "Cargando..."}</h6>
                      <p>{trip ? trip.direccionPartida : ""}</p>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-item destination">
                    <div className="route-dot destination-dot"></div>
                    <div className="route-info">
                      <span className="route-type">DESTINO</span>
                      <h6>{trip ? trip.provinciaDestino : "Cargando..."}</h6>
                      
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-divider"></div>

              {/* Asientos */}
              <div className="info-item">
                <div className="info-icon">💺</div>
                <div className="info-content">
                  <h5>DISPONIBILIDAD</h5>
                  <p>
                    {trip && car ? 
                      `${Math.max(0, car.cantidadAsientos - totalAsientosOcupados)} de ${car.cantidadAsientos} asientos libres` 
                      : "Cargando..."
                    }
                  </p>
                  <span className="seats-detail">
                    {totalAsientosOcupados > 0 ? `${totalAsientosOcupados} asientos reservados en total` : "Ningún asiento reservado aún"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de reserva mejorado */}
          <div className="available-trip-details-actions">
            <div className="form-header">
              <h3>🎫 Reserva tu Lugar</h3>
              <p>Completa los datos para unirte al viaje</p>
            </div>

            <div className="form-content">
              {/* Selección de asientos */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">💺</span>
                  <h4>Número de Asientos</h4>
                </div>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={asientos}
                  onChange={(e) => setAsientos(e.target.value)}
                  className="available-trip-details-seats-input modern-input"
                  placeholder="¿Cuántos asientos necesitas?"
                />
              </div>

              {/* Dirección de destino */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">📍</span>
                  <h4>Tu Destino Personal</h4>
                </div>
                {isLoaded ? (
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <input
                      type="text"
                      value={destino.direccion}
                      onChange={(e) => setDestino({ ...destino, direccion: e.target.value })}
                      className="available-trip-details-destination-input modern-input"
                      placeholder="¿Dónde quieres que te dejen?"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    disabled
                    value="Cargando sistema de mapas..."
                    className="available-trip-details-destination-input modern-input disabled"
                  />
                )}
              </div>

              {/* Mapa */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">🗺️</span>
                  <h4>Ubicación en el Mapa</h4>
                </div>
                <div className="map-container">
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{ lat: destino.latitud, lng: destino.longitud }}
                      zoom={13}
                      onClick={onMapClick}
                      options={{
                        styles: [
                          {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                          }
                        ]
                      }}
                    >
                      <Marker 
                        position={{ lat: destino.latitud, lng: destino.longitud }}
                        animation={window.google?.maps?.Animation?.BOUNCE}
                      />
                    </GoogleMap>
                  )}
                </div>
              </div>

              {/* Botón de reserva */}
              <button
                onClick={handleReserva}
                disabled={reserving}
                className={`available-trip-details-book-btn modern-btn ${reserving ? 'reserving' : ''}`}
              >
                {reserving ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Procesando Reserva...
                  </>
                ) : (
                  '🚀 ¡Reservar mi Lugar!'
                )}
              </button>

              {/* Mensaje de estado */}
              {mensaje && (
                <div className={`status-message ${mensaje.includes('Error') ? 'error' : mensaje.includes('exitosa') ? 'success' : 'info'}`}>
                  {mensaje}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AvailableTripDetails;