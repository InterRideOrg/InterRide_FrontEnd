import { useNavigate } from 'react-router-dom';
import './styles/TicketDestinyCard.css';

const TicketDestinyCard = ({ ticket }) => {
    const navigate = useNavigate();

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

    

    return (
        <div className={`ticket-destiny-card ${ticket.estado.toLowerCase().replace('_', '-')}`}>
            {/* Header reorganizado */}
            <div className="ticket-destiny-card-header">
                <div className="ticket-destiny-card-info-group">
                    <span className={`ticket-destiny-card-status ${ticket.estado.toLowerCase().replace('_', '-')}`}>
                        {getStatusText(ticket.estado)}
                    </span>
                    <span className="ticket-destiny-card-passengers">
                        {ticket.asientosOcupados} pasajero{ticket.asientosOcupados !== 1 ? 's' : ''}
                    </span>
                    {ticket.abordo && (
                        <div className="ticket-destiny-card-aboard">
                            <span>✓ A bordo</span>
                        </div>
                    )}
                </div>
                <button 
                    className="ticket-destiny-card-details-btn"
                    onClick={() => navigate(`/driver/current-trip/${ticket.conductorId}/${ticket.pasajeroId}/${ticket.viajeId}`)}
                >
                    Ver más detalles
                </button>
            </div>

            {/* Ruta */}
            <div className="ticket-destiny-card-route">
                <div className="ticket-destiny-card-origin">
                    <h4>Origen</h4>
                    <p className="ticket-destiny-card-province">{ticket.provinciaOrigen}</p>
                    <p className="ticket-destiny-card-address">{ticket.direccionPartida}</p>
                </div>

                <div className="ticket-destiny-card-arrow">
                    <span>→</span>
                </div>

                <div className="ticket-destiny-card-destination">
                    <h4>Destino</h4>
                    <p className="ticket-destiny-card-province">{ticket.provinciaDestino}</p>
                    <p className="ticket-destiny-card-address">{ticket.direccionDestino}</p>
                </div>
            </div>
        </div>
    );
}

export default TicketDestinyCard;