import { useRef, useState, useEffect} from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './styles/OnlyViewMap.css';

const center = { lat: -12.0464, lng: -77.0428 }; // Centro de Lima, Perú

export default function OnlyViewMap({ initialOrigin = '', initialDestination = '' }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const originRef = useRef();
  const destinationRef = useRef();


  useEffect(() => {
    if (
      isLoaded &&
      initialOrigin.trim() !== '' &&
      initialDestination.trim() !== ''
    ) {
      // Asegúrate de que los campos estén poblados antes de calcular la ruta
      if (originRef.current && destinationRef.current) {
        originRef.current.value = initialOrigin;
        destinationRef.current.value = initialDestination;
        calculateRoute();
      }
    }
  }, [isLoaded, initialOrigin, initialDestination]);

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando mapa...</p>
      </div>
    );
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }
    
    const directionsService = new window.google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error('Error al calcular la ruta:', error);
    }
  }

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      
      <div className="controls-panel">
        <div className="input-group">
          <div className="input-row">
            <div
              ref={originRef}
              className="map-input"
            />
            <div
              ref={destinationRef}
              className="map-input"
            />
            
          </div>
          
          <div className="info-row">
            <span className="info-text">Distancia: {distance}</span>
            <span className="info-text">Duración: {duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}