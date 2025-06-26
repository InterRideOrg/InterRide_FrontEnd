import { useNavigate } from "react-router-dom";
import './styles/AvailableTripCard.css';

const AvailableTripCard = ({ trip }) => {
    const navigate = useNavigate();

    return (
        <div className="trip-available-card-history">
            <div className="trip-available-info">
                <h3>{trip.provinciaDestino}</h3>
                <p className="trip-available-date">
                    {new Date(trip.fechaHoraPartida).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                    })} - {new Date(trip.fechaHoraPartida).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                
            </div>
            <button
                className="trip-available-more-btn"
                onClick={() => navigate(`/passenger/available-trips/${trip.viajeId}`)}
            >
                Viajar <span className="arrow-large">&rarr;</span>
            </button>
        </div>
    );
};

export default AvailableTripCard;
