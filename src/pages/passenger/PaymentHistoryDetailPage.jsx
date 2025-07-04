import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './styles/PaymentHistoryDetailPage.css';

const PaymentHistoryDetailPage = () => {
    const { pasajeroId, paymentId } = useParams();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [driver, setDriver] = useState(null);
    const navigate = useNavigate();

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axiosInstance.get(`/pagos/${paymentId}`);
                setPaymentDetails(response.data);
            } catch (error) {
                console.error("Error fetching payment details:", error);
                alert("Error al obtener los detalles del pago. Inténtalo de nuevo.");
            }
        };

        fetchPaymentDetails();
    }, [paymentId]);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            if (!paymentDetails || !paymentDetails.conductorId) return;
            try {
                const response = await axiosInstance.get(`/usuario/profile/conductor/${paymentDetails.conductorId}`);
                setDriver(response.data);
            } catch (error) {
                console.error("Error fetching driver details:", error);
                alert("Error al obtener los detalles del conductor. Inténtalo de nuevo.");
            }
        };

        fetchDriverDetails();
    }, [paymentDetails]);

    

    if (!paymentDetails) {
        return (
            <>
                <MainNavbar />
                <section className="payment-history-detail-page-sec">
                    <div className="payment-history-detail-page-loading">Cargando detalles del pago...</div>
                </section>
            </>
        );
    }

    return (
        <>
            <MainNavbar />
            <section className="payment-history-detail-page-sec">
                <div className="payment-history-detail-page-header">
                    <button 
                        className="payment-history-detail-page-back-btn"
                        onClick={() => navigate(`/passenger/payments/${pasajeroId}/history`)}
                    >
                        &larr; Volver al Historial
                    </button>
                    <h1>Detalles del Pago</h1>
                </div>

                <div className="payment-history-detail-page-content">
                    {/* Estado del Pago */}
                    <div className="payment-history-detail-page-section">
                        <div className="payment-history-detail-page-section-title">
                            <h5>Estado</h5>
                        </div>
                        <div className="payment-history-detail-page-section-text">
                            <span className={`payment-history-detail-page-status ${paymentDetails.estado.toLowerCase()}`}>
                                {paymentDetails.estado}
                            </span>
                        </div>
                    </div>

                    {/* Fecha y Hora del Pago */}
                    <div className="payment-history-detail-page-section">
                        <div className="payment-history-detail-page-section-title">
                            <h5>Fecha y Hora</h5>
                        </div>
                        <div className="payment-history-detail-page-section-text">
                            <p>{formatDate(paymentDetails.fechaHoraPago)}</p>
                        </div>
                    </div>

                    {/* Conductor */}
                    <div className="payment-history-detail-page-section">
                        <div className="payment-history-detail-page-section-title">
                            <h5>Conductor</h5>
                        </div>
                        <div className="payment-history-detail-page-section-text">
                            <p>{driver ? `${driver.nombre} ${driver.apellidos}` : "Cargando..."}</p>
                            {driver && (
                                <p className="payment-history-detail-page-driver-contact">
                                    {driver.telefono}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Monto */}
                    <div className="payment-history-detail-page-section payment-history-detail-page-amount-section">
                        <div className="payment-history-detail-page-section-title">
                            <h5>Monto</h5>
                        </div>
                        <div className="payment-history-detail-page-section-text">
                            <p className="payment-history-detail-page-amount">S/. {paymentDetails.monto}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PaymentHistoryDetailPage;