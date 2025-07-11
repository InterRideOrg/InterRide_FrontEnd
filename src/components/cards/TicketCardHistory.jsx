import { useNavigate } from "react-router-dom";
import './styles/TicketCardHistory.css';

const TicketCardHistory = ({ ticket }) => {
    const navigate = useNavigate();

    return (
        <div className="ticket-card-history">
            <div className="ticket-info">
                <h3>{ticket.provinciaDestino}</h3>
                <p className="ticket-date">
                    {new Date(ticket.fechaHoraPartida).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                    })} - {new Date(ticket.fechaHoraPartida).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                <p className="ticket-price">{ticket.costo.toFixed(2)} PEN</p>
            </div>
            <button
                className="ticket-more-btn"
                onClick={() => navigate(`/tickets/${ticket.pasajeroId}/${ticket.viajeId}`)}
            >
                Detalles <span className="arrow-large">&rarr;</span>
            </button>
        </div>
    );
}

export default TicketCardHistory;