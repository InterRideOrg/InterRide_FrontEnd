import { useNavigate } from "react-router-dom";
import './styles/CompletePaymentCard.css'; 

const CompletePaymentCard = ({ payment }) => {
    
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        
        const date = new Date(dateString);
        
        // Opción 1: Formato español completo 
        /*return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });*/
        
        // Opción 2: Solo fecha sin hora
        // return date.toLocaleDateString('es-ES', {
        //     day: '2-digit',
        //     month: '2-digit',
        //     year: 'numeric'
        // });
        
         //Opción 3: Formato más legible con nombre del mes
         return date.toLocaleDateString('es-ES', {
             day: 'numeric',
             month: 'long',
             year: 'numeric'
         });
    };

    return (
        <>
            <div className="complete-payment-card">
                <div className="complete-payment-card-details">
                    <div>
                        <p className="complete-payment-card-title">
                            {payment? payment.monto : "Monto no disponible"} PEN
                        </p>
                        <p className="complete-payment-card-subtitle">
                            {formatDate(payment?.fechaHoraPago)}
                        </p>
                    </div>
                    
                    <button 
                    className="complete-payment-card-btn"
                    onClick={() => navigate(`/passenger/payments/${payment.pasajeroId}/details/${payment.id}/completed`)}>
                        Ver Detalles
                        <span className="arrow-large">&rarr;</span>
                    </button>
                </div>
            </div>
        </>
        
    );
}


export default CompletePaymentCard;