import MainNavbar from "../../components/navigation/MainNavbar";
import { useParams } from "react-router-dom";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import BasicSelect from "../../components/ui/BasicSelect";
import axiosInstance from "../../interceptors/axiosInstance";
import './styles/PaymentDetailPage.css';




const PaymentDetailPage = () => {
    const [cards, setCards] = useState([]);
    const [payment, setPayment] = useState(null);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
    const [driver, setDriver] = useState(null);
    const { pasajeroId, paymentId } = useParams();
    const [ticket, setTicket] = useState(null);
    const navigate = useNavigate();

    const handlePagar = () => {
        
        if (metodoSeleccionado < 0 || metodoSeleccionado === '') {
            console.log(metodoSeleccionado);
            alert("Seleccione un método de pago.");
            return;
        }

        axiosInstance.put(`/pagos/${paymentId}/${metodoSeleccionado}`)
        .then(() => {
            alert("Pago realizado con éxito.");
            navigate(`/passenger/payments/${pasajeroId}`);
        })
        .catch(error => {
            console.error("Error al realizar el pago:", error);
            alert(error.response?.data?.detail || "Error al realizar el pago.");
        });
    };

    useEffect(() => {
        axiosInstance.get(`/pagos/${paymentId}`)
        .then(response => {
            setPayment(response.data);
        })
        .catch(error => {
            console.error('Error fetching payment details:', error);
            alert("Error al obtener los detalles del pago.");
        });
    }, [paymentId]);


    useEffect(() => {
        if (!payment || !payment.conductorId) return;

        axiosInstance.get(`usuario/profile/conductor/${payment.conductorId}`)
        .then(response => {
            setDriver(response.data);
        })
        .catch(error => {
            console.error('Error fetching driver details:', error);
            alert("Error al obtener los detalles del conductor.");
        });
    }, [payment]);

    useEffect(() => {
        if (!payment) return;
        const fetchTicket = async () => {
            try {
                const response = await axiosInstance.get(`/boletos/${payment.pasajeroId}/${payment.viajeId}`);
                setTicket(response.data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
            }
        };

        fetchTicket();
    }, [payment]);

    

    useEffect(() => {
        axiosInstance.get(`/tarjetas/${pasajeroId}`)
        .then(response => {
            const tarjetas = response.data;
            const tarjetasConEfectivo = [
                { id: 0, numeroTarjeta: 'Efectivo' }, 
                ...tarjetas
        ];
        setCards(tarjetasConEfectivo);
        })
        .catch(error => {
        console.error('Error fetching available cards:', error);
        });
}, [pasajeroId]);

    return (
        <>
            <MainNavbar />
            <section className="payment-detail-page-sec">
                <h1>Información del pago</h1>
                <div className="payment-detail-page-content">
                    <div className="payment-detail-page-driver">
                        <div className="payment-detail-page-driver-title">
                            <h5>Conductor</h5>
                        </div>
                        <div className="payment-detail-page-driver-text">
                            <p>{driver ? driver.nombre : "name"} {driver ? driver.apellidos : "surname"}</p>
                        </div>
                    </div>
                    <div className="payment-detail-page-origin">
                        <div className="payment-detail-page-origin-title">
                            <h5>Origen</h5>
                        </div>
                        <div className="payment-detail-page-origin-text">
                            <p>
                                 <p>{ticket ? `${ticket.direccionPartida} - ${ticket.provinciaOrigen}` : "Cargando..."}</p>
                            </p>
                        </div>
                    </div>

                    <div className="payment-detail-page-destination">
                        <div className="payment-detail-page-destination-title">
                            <h5>Destino</h5>
                        </div>
                        <div className="payment-detail-page-destination-text">
                            <p>
                                {ticket ? `${ticket.direccionDestino} - ${ticket.provinciaDestino}` : "Cargando..."}
                            </p>
                        </div>
                    </div>
                    <div className="payment-detail-page-amount">
                        <div className="payment-detail-page-amount-title">
                            <h5>Total a pagar</h5>
                        </div>
                        <div className="payment-detail-page-amount-text">
                            <p>S/. {payment ? payment.monto : 0}</p>
                        </div>
                    </div>
                    <div className="payment-detail-page-payment-method">
                        <div className="payment-detail-page-payment-method-title">
                            <h5>Método de pago</h5> 
                        </div>
                        <div className="payment-detail-page-payment-method-text">
                            <div className="payment-detail-page-payment-method-select">
                                <BasicSelect
                                    target={metodoSeleccionado}
                                    setTarget={setMetodoSeleccionado}
                                    targetLabel="Método"
                                    options={cards}
                                    valueKey="id"
                                    labelKey="numeroTarjeta"
                                />
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="payment-detail-page-button">
                    <button className="payment-detail-page-button-pay" onClick={handlePagar}>
                        Pagar
                    </button>
                </div>
            </section>
        </>
    );
}


export default PaymentDetailPage;