import { useParams } from "react-router-dom";
import MainNavbar from "../../components/navigation/MainNavbar";
import { useState, useEffect } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import dayjs from "dayjs";
import './styles/AvailableTripDetails.css'; // Assuming you have a CSS file for styling

const AvailableTripDetails = () => {
    const { viajeId } = useParams();

    const [trip, setTrip] = useState(null);
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        axiosInstance.get(`/trips/viajesDisponibles/${viajeId}`)
            .then(response => {
                setTrip(response.data);
            })
            .catch(error => {
                console.error('Error fetching trip details:', error);
            });
    }, [viajeId]);

    useEffect(() => {
        if (trip) {
            axiosInstance.get(`/usuario/profile/conductor/${trip.conductorId}`)
                .then(response => {
                    setDriver(response.data);
                })
                .catch(error => {
                    console.error('Error fetching driver details:', error);
                });
        }
    }, [trip]);


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
                            <p>{trip ? trip.provinciaDestino : 'Cargando...'}</p>
                            <p>Información del viaje</p>
                        </div>
                        <div className="available-trip-details-info-body">
                            <div className="available-trip-details-info-driver">
                                <h5>CONDUCTOR</h5>
                                <p>{driver ? `${driver.nombre} ${driver.apellidos}` : 'Cargando...'}</p>
                            </div>
                            <div className="available-trip-details-info-date">
                                <h5>FECHA Y HORA DE PARTIDA</h5>
                                <p>{trip ? dayjs(trip.fechaHoraPartida).format("DD/MM/YYYY - HH:mm") : "Cargando..."}</p>
                            </div>
                            <div className="available-trip-details-info-origin">
                                <h5>ORIGEN</h5>
                                <p>{trip ? `${trip.direccionPartida} - ${trip.provinciaOrigen} ` : 'Cargando...'}</p>
                            </div>
                            <div className="available-trip-details-info-available-seats">
                                <h5>ASIENTOS DISPONIBLES</h5>
                                <p>{trip ? trip.asientosDisponibles : 'Cargando...'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="available-trip-details-actions">
                        <div className="available-trip-details-actions-seats-quantity">
                            <h5>RESERVA DE ASIENTOS</h5>
                            <p>Selecciona el número de asientos que deseas reservar.</p>
                            <input type="number" min ="1" defaultValue="1" className="available-trip-details-seats-input" />
                        </div>
                        <div className="available-trip-details-actions-destination">
                            <h5>INGRESA TU DESTINO</h5>
                            <p>Especifica la dirección de destino para el viaje.</p>
                            <input type="text" placeholder="Ingresa tu dirección de destino" className="available-trip-details-destination-input" />
                        </div>
                        <div className="available-trip-details-actions-booking">
                            <button className="available-trip-details-book-btn">
                                Reservar Viaje
                            </button>
                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    );
}

export default AvailableTripDetails;