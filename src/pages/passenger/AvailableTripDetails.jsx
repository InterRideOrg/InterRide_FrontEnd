import { useParams, useNavigate } from "react-router-dom";
import MainNavbar from "../../components/navigation/MainNavbar";
import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import dayjs from "dayjs";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

import './styles/AvailableTripDetails.css';

const containerStyle = {
  width: "100%",
  height: "300px",
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
    axiosInstance.get(`/boletos/viaje/${viajeId}`)
      .then(async res => {
        const boletos = res.data;
        if (boletos.length > 0) {
          const viaje = boletos[0];
          setTrip(viaje);

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
            .then(res => setDriver(res.data))
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
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

      navigate(`/passenger/home/${userId}`);
    } catch (err) {
      console.error(err);
      setMensaje("Error al reservar.");
    }
  };

  return (
    <>
      <MainNavbar />
      <section className="available-trip-details-sec">
        <div className="available-trip-details-header">
          <h1>Detalles del Viaje</h1>
          <p>Reserva tu viaje ahora!</p>
        </div>
        <div className="available-trip-details-content">
          <div className="available-trip-details-info">
            <div className="available-trip-details-info-header">
              <p>{trip ? trip.provinciaDestino : "Cargando..."}</p>
              <p>Información del viaje</p>
            </div>
            <div className="available-trip-details-info-body">
              <div><h5>CONDUCTOR</h5><p>{driver ? `${driver.nombre} ${driver.apellidos}` : "Cargando..."}</p></div>
              <div><h5>FECHA Y HORA DE PARTIDA</h5><p>{trip ? dayjs(trip.fechaHoraPartida).format("DD/MM/YYYY - HH:mm") : "Cargando..."}</p></div>
              <div><h5>ORIGEN</h5><p>{trip ? `${trip.direccionPartida} - ${trip.provinciaOrigen}` : "Cargando..."}</p></div>
              <div><h5>DESTINO</h5><p>{trip ? `${trip.direccionDestino} - ${trip.provinciaDestino}` : "Cargando..."}</p></div>
              <div><h5>ASIENTOS OCUPADOS</h5><p>{trip ? trip.asientosOcupados : "Cargando..."}</p></div>
            </div>
          </div>

          <div className="available-trip-details-actions">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Reserva de Asientos</Typography>
                <TextField
                  type="number"
                  label="Cantidad"
                  fullWidth
                  value={asientos}
                  inputProps={{ min: 1, max: 8 }}
                  onChange={(e) => setAsientos(e.target.value)}
                  sx={{ mb: 3, bgcolor: "#fff", borderRadius: 2 }}
                />
                <Typography variant="h6">Dirección de Destino</Typography>
                {isLoaded ? (
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <TextField
                      label="Dirección"
                      fullWidth
                      value={destino.direccion}
                      onChange={(e) => setDestino({ ...destino, direccion: e.target.value })}
                      sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
                    />
                  </Autocomplete>
                ) : (
                  <TextField
                    label="Dirección"
                    fullWidth
                    disabled
                    value="Cargando mapa..."
                    sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6">Ubica tu destino en el mapa</Typography>
                <Box sx={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden", mb: 2 }}>
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{ lat: destino.latitud, lng: destino.longitud }}
                      zoom={13}
                      onClick={onMapClick}
                    >
                      <Marker position={{ lat: destino.latitud, lng: destino.longitud }} />
                    </GoogleMap>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReserva}
                  fullWidth
                >
                  Unirse al viaje
                </Button>
                {mensaje && (
                  <Typography align="center" mt={2} color="info.main">
                    {mensaje}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </section>
    </>
  );
};

export default AvailableTripDetails;
