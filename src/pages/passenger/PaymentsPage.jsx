import MainNavbar from "../../components/navigation/MainNavbar";
import { useEffect, useState } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import PendingPaymentCard from "../../components/cards/PendingPaymentCard";
import PaymentMethodCard from "../../components/cards/PaymentMethodCard";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './styles/PaymentsPage.css';

const PaymentsPages = () => {
    const navigate = useNavigate();
    const [pendingPayments, setPendingPayments] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const { pasajeroId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentsResponse, methodsResponse] = await Promise.all([
                    axiosInstance.get(`/pagos/pendientes/pasajero/${pasajeroId}`),
                    axiosInstance.get(`/tarjetas/${pasajeroId}`),
                ]);
                setPendingPayments(paymentsResponse.data);
                setPaymentMethods(methodsResponse.data);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };
        fetchData();
    }, [pasajeroId]);

    const handleRemoveCard = async (cardId) => {
        try {
            const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta tarjeta?");
            if (!confirmed) return;

            await axiosInstance.delete(`/tarjetas/${cardId}`);
            
            setPaymentMethods(prevMethods => 
                prevMethods.filter(method => method.id !== cardId)
            );
            
        } catch (error) {
            console.error("Error al eliminar la tarjeta:", error);
            alert(error.response?.data?.detail || "Error al eliminar la tarjeta");
        }
    };

    return (
        <>
            <MainNavbar />
            <section className="payments-page-sec">
                <div className="payments-page-pending-payments">
                    <div className="payments-page-pending-payments-title">
                        <h4>Pagos Pendientes</h4>
                    </div>
                    <div className="payments-page-pending-payments-list">
                        {pendingPayments && pendingPayments.length > 0 ? (
                            pendingPayments.map(payment => (
                                <PendingPaymentCard key={payment.id} payment={payment} />
                            ))
                        ) : (
                            <p>No se encontraron pagos pendientes en este momento.</p>
                        )}
                    </div>
                </div>
                <div className="payments-page-methods-payments">
                    <div className="payments-page-methods-payments-title">
                        <h4>Medios de Pago</h4>
                    </div>
                    <div className="payments-page-methods-payments-list">
                        <div className="payment-method-card">
                            <p>Efectivo</p>
                        </div>
                        {paymentMethods && paymentMethods.length > 0 ? (
                            paymentMethods.map(method => (
                                <PaymentMethodCard
                                    key={method.id}
                                    paymentMethod={method}
                                    onRemove={handleRemoveCard}
                                 />
                            ))
                        ) : ""}
                    </div>
                    <div className="payments-page-methods-payments-add">
                        <button 
                            className="payments-page-methods-payments-add-btn"
                            onClick={() => navigate(`/passenger/payments/${pasajeroId}/add-method`)}>
                            Agregar Medio de Pago
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PaymentsPages;
