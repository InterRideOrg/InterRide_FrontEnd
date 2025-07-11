import { useNavigate } from "react-router-dom";
import './styles/TicketReservedCard.css';

const TicketReservedCard = ({ ticket }) => {
    const navigate = useNavigate();

    return (
        <div className="ticket-card-reserved">
            <div className="ticket-reserved-info">
                <h5>{ticket.provinciaDestino}</h5>
                <p className="ticket-reserved-date">
                    {new Date(ticket.fechaHoraPartida).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                    })} - {new Date(ticket.fechaHoraPartida).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                <p className="ticket-reserved-price">{ticket.costo.toFixed(2)} PEN</p>
            </div>
            <div className="ticket-reserved-actions">
                <button
                    className="ticket-reserved-more-btn"
                    onClick={() => navigate(`/passenger/requested-trips/${ticket.pasajeroId}/${ticket.viajeId}`)}
                >
                    Detalles <span className="arrow-large">&rarr;</span>
                </button>
            </div>
                
        </div>
    );
}

export default TicketReservedCard;