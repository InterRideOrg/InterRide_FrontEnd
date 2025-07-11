import MainNavbar from '../../components/navigation/MainNavbar';
import OnlyViewMap from '../../components/maps/OnlyViewMap';
import axiosInstance from '../../interceptors/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/TicketCurrentTripPage.css';

const TicketCurrentTripPage = () => {
    const { conductorId, pasajeroId, viajeId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finalizing, setFinalizing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/boletos/${pasajeroId}/${viajeId}`);
                setTicket(response.data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
                setError('Error al cargar los detalles del boleto');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [pasajeroId, viajeId]);

    // Función para formatear fecha y hora
    const formatDateTime = (dateString) => {
        if (!dateString) return "No disponible";
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para obtener el estado en español
    const getStatusText = (status) => {
        switch(status) {
            case 'EN_CURSO':
                return 'En Curso';
            case 'COMPLETADO':
                return 'Completado';
            case 'PENDIENTE':
                return 'Pendiente';
            case 'CANCELADO':
                return 'Cancelado';
            default:
                return status;
        }
    };

    // Función para finalizar el boleto
    const handleFinalizeTicket = async () => {
        if (!ticket || ticket.estado !== 'EN_CURSO') return;

        setFinalizing(true);
        try {
            await axiosInstance.put(`/boletos/${ticket.boletoId}/finalizar`);
            
            // Actualizar el estado del ticket localmente
            setTicket(prev => ({
                ...prev,
                estado: 'COMPLETADO'
            }));

            alert('¡Boleto finalizado correctamente!');
            navigate(`/driver/current-trip/${conductorId}/${viajeId}`);
        } catch (error) {
            console.error('Error finalizing ticket:', error);
            alert('Error al finalizar el boleto. Inténtalo de nuevo.');
        } finally {
            setFinalizing(false);
        }
    };

    if (loading) {
        return (
            <>
                <MainNavbar />
                <section className="ticket-current-trip-page-sec">
                    <div className="ticket-current-trip-page-loading">
                        <div className="ticket-current-trip-page-spinner"></div>
                        <p>Cargando detalles del boleto...</p>
                    </div>
                </section>
            </>
        );
    }

    if (error || !ticket) {
        return (
            <>
                <MainNavbar />
                <section className="ticket-current-trip-page-sec">
                    <div className="ticket-current-trip-page-error">
                        <h3>⚠️ Error</h3>
                        <p>{error || 'No se encontró el boleto'}</p>
                        <button 
                            className="ticket-current-trip-page-back-btn"
                            onClick={() => navigate(`/driver/current-trip/${conductorId}/${pasajeroId}/${viajeId}`)}
                        >
                            Volver
                        </button>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <MainNavbar />
            <section className="ticket-current-trip-page-sec">
                <div className="ticket-current-trip-page-header">
                    <button 
                        className="ticket-current-trip-page-back-btn"
                        onClick={() => navigate(`/driver/current-trip/${conductorId}/${viajeId}`)}
                    >
                        ← Volver al viaje
                    </button>
                    <h1>Detalles del Boleto</h1>
                </div>

                <div className="ticket-current-trip-page-content">
                    {/* Estado y acciones */}
                    <div className="ticket-current-trip-page-status-section">
                        <div className="ticket-current-trip-page-status-info">
                            <span className={`ticket-current-trip-page-status ${ticket.estado.toLowerCase().replace('_', '-')}`}>
                                {getStatusText(ticket.estado)}
                            </span>
                            {ticket.abordo && (
                                <span className="ticket-current-trip-page-aboard">✓ A bordo</span>
                            )}
                        </div>
                        
                        {ticket.estado === 'EN_CURSO' && (
                            <button 
                                className="ticket-current-trip-page-finalize-btn"
                                onClick={handleFinalizeTicket}
                                disabled={finalizing}
                            >
                                {finalizing ? 'Finalizando...' : 'Finalizar Viaje'}
                            </button>
                        )}
                    </div>

                    {/* Información del pasajero */}
                    <div className="ticket-current-trip-page-section">
                        <h3>Información del Viaje</h3>
                        <div className="ticket-current-trip-page-info-grid">
                            <div className="ticket-current-trip-page-info-item">
                                <span className="ticket-current-trip-page-label">Pasajeros:</span>
                                <span className="ticket-current-trip-page-value">{ticket.asientosOcupados}</span>
                            </div>
                            <div className="ticket-current-trip-page-info-item">
                                <span className="ticket-current-trip-page-label">Ganancia:</span>
                                <span className="ticket-current-trip-page-value">S/. {ticket.costo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Mapa de la ruta */}
                    <div className="ticket-current-trip-page-section">
                        <h3>Mapa de la Ruta</h3>
                        <div className="ticket-current-trip-page-map-container">
                            <OnlyViewMap 
                                initialOrigin={ticket.direccionPartida}
                                initialDestination={ticket.direccionDestino}
                            />
                        </div>
                    </div>

                    {/* Ruta */}
                    <div className="ticket-current-trip-page-section">
                        <h3>Direcciones</h3>
                        <div className="ticket-current-trip-page-route">
                            <div className="ticket-current-trip-page-location">
                                <h4>Origen</h4>
                                <p className="ticket-current-trip-page-province">{ticket.provinciaOrigen}</p>
                                <p className="ticket-current-trip-page-address">{ticket.direccionPartida}</p>
                            </div>
                            
                            <div className="ticket-current-trip-page-arrow">
                                <span>→</span>
                            </div>
                            
                            <div className="ticket-current-trip-page-location">
                                <h4>Destino</h4>
                                <p className="ticket-current-trip-page-province">{ticket.provinciaDestino}</p>
                                <p className="ticket-current-trip-page-address">{ticket.direccionDestino}</p>
                            </div>
                        </div>
                    </div>

                    {/* Horarios (sin fecha de unión) */}
                    <div className="ticket-current-trip-page-section">
                        <h3>Horarios</h3>
                        <div className="ticket-current-trip-page-times">
                            <div className="ticket-current-trip-page-time-item">
                                <span className="ticket-current-trip-page-time-label">Fecha de Partida:</span>
                                <span className="ticket-current-trip-page-time-value">{formatDateTime(ticket.fechaHoraPartida)}</span>
                            </div>
                            <div className="ticket-current-trip-page-time-item">
                                <span className="ticket-current-trip-page-time-label">Fecha de Llegada:</span>
                                <span className="ticket-current-trip-page-time-value">{formatDateTime(ticket.fechaHoraLlegada)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default TicketCurrentTripPage;