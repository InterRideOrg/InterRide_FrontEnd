/*
Ejmplo de ticket
{
        "boletoId": 2,
        "viajeId": 2,
        "pasajeroId": 1,
        "fechaHoraLlegada": "2025-06-27T23:40:17.476726",
        "fechaHoraUnion": "2025-06-24T23:40:17.474625",
        "asientosOcupados": 3,
        "costo": 25.0,
        "estado": "COMPLETADO",
        "abordo": true,
        "provinciaOrigen": "Lima",
        "provinciaDestino": "Av. Benavides 234",
        "direccionPartida": "Huaura",
        "direccionDestino": "Jr. Lima 234"
    }
*/

/*
    mostrar
    provinciaDestino
    Fecha de esta manera: 9 Mar - 13:15
    Precio

    Y un ver mas para dirigirse a la pagina de detalles del ticket
*/ 

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