import MainNavbar from "../../components/navigation/MainNavbar";
import { useEffect, useState } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import PendingPaymentCard from "../../components/cards/PendingPaymentCard";
import { useParams } from "react-router-dom";
import './styles/PaymentsPage.css';

const PaymentsPages = () => {
    
    const [pendingPayments, setPendingPayments] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);


    const { pasajeroId } = useParams();

    console.log("Pasajero ID:", pasajeroId);

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

    console.log("Pending Payments:", pendingPayments);

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
                        <h4>Métodos de Pago</h4>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PaymentsPages;
