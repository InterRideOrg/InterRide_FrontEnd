import { useNavigate } from "react-router-dom";
import './styles/PendingPaymentCard.css'; 

const PendingPaymentCard = ({ payment }) => {
    
    const navigate = useNavigate();

    return (
        <>
            <div className="pending-payment-card">
                <div className="pending-payment-card-details">
                    <p>{payment ? payment.monto : 0} PEN</p>
                    <button 
                    className="pending-payment-card-btn"
                    onClick={() => navigate(`/passenger/payments/${payment.pasajeroId}/details/${payment.id}`)}>
                        Ver Detalles
                        <span className="arrow-large">&rarr;</span>
                    </button>
                </div>
            </div>
        </>
        
    );
}


export default PendingPaymentCard;