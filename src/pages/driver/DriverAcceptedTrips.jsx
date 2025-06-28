import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import './styles/DriverAcceptedTrips.css'; 


const DriverAcceptedTrips = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();
    
    const { data: trips = [] } = useQuery({
        enabled  : !!driverId,
        queryKey : ["viajesProximos", driverId],
        queryFn  : () =>
        axiosInstance
            .get(`/trips/viajesAceptados/${driverId}`)
            .then(r => r.data)
            .catch(err => {
            if (err.response?.status === 404) return [];
            throw err;
            }),
        staleTime: 30_000,
    });


    return (
        <>
        <MainNavbar />
        <section className="DriverAcceptedTrips-sec">
            <div className="DriverAcceptedTrips-header">
                <h2>Proximos viajes</h2>
            </div>
            <div className="DriverAcceptedTrips-content">
                {trips.length ? (
                    trips.map(trip => (
                        <div key={trip.idViaje} className="DriverAcceptedTrips-trip-card">
                            <div>
                                <p>{trip.provinciaOrigen} - {trip.provinciaDestino}</p>
                                <p>{trip.asientosDisponibles} asientos disponibles</p>
                            </div>
                            <button onClick={() => navigate(`/driver/${driverId}/accepted-trips/${trip.idViaje}`)}>
                                Ver Detalles
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No tienes viajes por completar.</p>
                )}
            </div>
            
            
        </section>
            
        </>
    );
};

export default DriverAcceptedTrips;