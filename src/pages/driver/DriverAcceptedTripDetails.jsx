import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import MainNavbar from "../../components/navigation/MainNavbar";
import './styles/DriverAcceptedTripDetails.css';

const DriverAcceptedTripDetails = () => {
    const { driverId, viajeId } = useParams();
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);
    
    const { data: tripDetails, isLoading } = useQuery({
        queryKey: ["tripDetails", viajeId],
        queryFn: () => axiosInstance.get(`/trips/viajeAceptado/${viajeId}/conductor`).then(res => res.data),
        enabled: !!viajeId,
    });

    const { data: tickets, isLoading: isTicketsLoading } = useQuery({
        queryKey: ["tickets", viajeId],
        queryFn: () => axiosInstance.get(`/boletos/viaje/${viajeId}`).then(res => res.data),
        enabled: !!viajeId,
    });

    // 🚀 Función para empezar el viaje
    const handleStartTrip = async () => {
        try {
            setIsStarting(true);
            
            const confirm = window.confirm("¿Estás seguro de que deseas empezar este viaje?");
            if (!confirm) {
                setIsStarting(false);
                return;
            }

            await axiosInstance.put(`/trips/${viajeId}/empezar/${driverId}`);
            
            alert("¡Viaje iniciado exitosamente!");
            
            navigate(`/driver/home/${driverId}/`);
            
        } catch (error) {
            console.error('Error starting trip:', error);
            alert(error.response?.data?.detail || "Error al iniciar el viaje. Inténtalo de nuevo.");
        } finally {
            setIsStarting(false);
        }
    };

    if (isLoading || isTicketsLoading) return <div>Loading...</div>;

    return (
        <>
            <MainNavbar />
            <section className="DriverAcceptedTripDetails-sec">
                <div className="DriverAcceptedTripDetails-header">
                    <h2>Detalles del Viaje</h2>
                </div>
                <div className="DriverAcceptedTripDetails-content">
                    <p><strong>Origen:</strong> {tripDetails.provinciaOrigen}</p>
                    <p><strong>Destino:</strong> {tripDetails.provinciaDestino}</p>
                    <p><strong>Fecha y Hora de Partida:</strong> {new Date(tripDetails.fechaHoraPartida).toLocaleString()}</p>
                    <p><strong>Asientos Disponibles:</strong> {tripDetails.asientosDisponibles}</p>
                </div>
                <div className="DriverAcceptedTripDetails-tickets">
                    <h3>Boletos</h3>
                    {tickets && tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <div key={ticket.boletoId} className="DriverAcceptedTripDetails-ticket-card">
                                <p><strong>Destino:</strong> {ticket.direccionDestino} - {ticket.provinciaDestino}</p>
                                <p><strong>Asientos Reservados:</strong> {ticket.asientosOcupados}</p>
                                <p><strong>Ganancia:</strong> {ticket.costo}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay pasajeros reservados para este viaje.</p>
                    )}
                </div>
                <div className="DriverAcceptedTripDetails-trip-actions">
                    <button 
                        type="button"
                        onClick={handleStartTrip}
                        disabled={isStarting}
                        className={isStarting ? 'btn-loading' : ''}
                    >
                        {isStarting ? 'Iniciando...' : 'Empezar viaje'}
                    </button>
                    <button onClick={() => navigate(`/driver/${driverId}/accepted-trips`)}>
                        Volver a Viajes Aceptados
                    </button>
                </div>
            </section>
        </>
    );
};

export default DriverAcceptedTripDetails;