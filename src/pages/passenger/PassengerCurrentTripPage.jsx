import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import dayjs from "dayjs";
import OnlyViewMap from "../../components/maps/OnlyViewMap";
import MainNavbar from "../../components/navigation/MainNavbar";
import './styles/PassengerCurrentTripPage.css';

const PassengerCurrentTripPage = () => {
    const { pasajeroId, viajeId } = useParams();
    
    const [ticket, setTicket] = useState(null);
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await axiosInstance.get(`/boletos/${pasajeroId}/${viajeId}`);
                setTicket(response.data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
            }
        };

        fetchTicket();
    }, [pasajeroId, viajeId]);

    useEffect(() => {
        const fetchDriver = async () => {
            if (ticket && ticket.conductorId) {
                try {
                    const response = await axiosInstance.get(`/usuario/profile/conductor/${ticket.conductorId}`);
                    setDriver(response.data);
                } catch (error) {
                    console.error('Error fetching driver:', error);
                }
            }
        };

        fetchDriver();
    }, [ticket]);

    return (
        <>
            <MainNavbar />
            <section className="current-trip-page-sec-current-trip">
                <div className="current-trip-page-title">
                    <h1>Viaje en Curso</h1>
                </div>
                <div className="current-trip-page-principal">
                    <div className="current-trip-page-info">
                        <div className="current-trip-page-info-driver">
                            <div className="current-trip-page-info-driver-title">
                                <h4>Conductor</h4>
                            </div>
                            <div className="current-trip-page-info-driver-text">
                                {driver ? (
                                    <p>{driver.nombre} {driver.apellidos}</p>
                                ) : (
                                    <p>Cargando información del conductor...</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="current-trip-page-info-arrival">
                            <div className="current-trip-page-info-arrival-title">
                                <h4>Hora de llegada estimada</h4>
                            </div>
                            <div className="current-trip-page-info-arrival-text">
                                {ticket ? (
                                    <p>{dayjs(ticket.fechaHoraLlegada).format('DD/MM/YYYY - HH:mm')}</p>
                                ) : (
                                    <p>Cargando hora de llegada...</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="current-trip-page-info-origin">
                            <div className="current-trip-page-info-origin-title">
                                <h4>Origen</h4>
                            </div>
                            <div className="current-trip-page-info-origin-text">
                                {ticket ? (
                                    <p>{ticket.direccionPartida} - {ticket.provinciaOrigen}</p>
                                ) : (      
                                    <p>Cargando información de origen...</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="current-trip-page-info-destination">
                            <div className="current-trip-page-info-destination-title">
                                <h4>Destino</h4>
                            </div>
                            <div className="current-trip-page-info-destination-text">
                                {ticket ? (
                                    <p>{ticket.direccionDestino} - {ticket.provinciaDestino}</p>
                                ) : (
                                    <p>Cargando información de destino...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="current-trip-page-map-container">
                        <div className="current-trip-page-map-header">
                            <h3>Ruta del Viaje</h3>
                        </div>
                        <div className="current-trip-page-map">
                            <div className="current-trip-page-map-wrapper">
                                {ticket ? (
                                    <OnlyViewMap
                                        initialOrigin={ticket.direccionPartida}
                                        initialDestination={ticket.direccionDestino}
                                    />
                                ) : (
                                    <div className="current-trip-page-map-loading">
                                        <div className="current-trip-page-spinner"></div>
                                        <p>Cargando mapa...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PassengerCurrentTripPage;