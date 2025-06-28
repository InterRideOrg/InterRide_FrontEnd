import MainNavbar from "../../components/navigation/MainNavbar";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import './styles/AddPaymentMethodPage.css';

const AddPaymentMethodPage = () => {
    const { pasajeroId } = useParams();
    const navigate = useNavigate();
    
    const [cardData, setCardData] = useState({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaVencimiento: '',
        cvv: '',
        tipoTarjeta: 'VISA'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    const formatCardNumber = (value) => {
        const cleanValue = value.replace(/\s/g, '').replace(/\D/g, '');
        const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
        return formattedValue.substring(0, 19); // Máximo 16 dígitos + 3 espacios
    };

    // Formatear fecha MM/YY
    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length >= 2) {
            return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
        }
        return cleanValue;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        switch (name) {
            case 'numeroTarjeta':
                formattedValue = formatCardNumber(value);
                break;
            case 'fechaVencimiento':
                formattedValue = formatExpiryDate(value);
                break;
            case 'cvv':
                formattedValue = value.replace(/\D/g, '').substring(0, 4);
                break;
            case 'nombreTitular':
                formattedValue = value.toUpperCase();
                break;
        }

        setCardData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Limpiar errores cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardData.numeroTarjeta || cardData.numeroTarjeta.replace(/\s/g, '').length < 16) {
            newErrors.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos';
        }

        if (!cardData.nombreTitular || cardData.nombreTitular.length < 3) {
            newErrors.nombreTitular = 'El nombre del titular es requerido';
        }

        if (!cardData.fechaVencimiento || cardData.fechaVencimiento.length < 5) {
            newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida (MM/YY)';
        }

        if (!cardData.cvv || cardData.cvv.length < 3) {
            newErrors.cvv = 'El CVV debe tener al menos 3 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const dataToSend = {
                numeroTarjeta: cardData.numeroTarjeta.replace(/\s/g, ''), 
                nombreTitular: cardData.nombreTitular.toUpperCase(),
                fechaExpiracion: cardData.fechaVencimiento,
                codigoSeguridad: cardData.cvv,
            };

            await axiosInstance.post(`/tarjetas/pasajero/${pasajeroId}`, dataToSend);
            alert('Tarjeta agregada exitosamente');
            navigate(`/passenger/payments/${pasajeroId}`);
        } catch (error) {
            console.error('Error al agregar tarjeta:', error);
            alert(error.response?.data?.detail || 'Error al agregar la tarjeta');
        } finally {
            setIsLoading(false);
        }
    };

    const getCardType = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'VISA';
        if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'MASTERCARD';
        if (cleanNumber.startsWith('3')) return 'AMEX';
        return 'VISA';
    };

    return (
        <>
            <MainNavbar />
            <section className="add-payment-method-sec">
                <div className="add-payment-method-container">
                    <h1>Agregar Método de Pago</h1>
                    
                    {/* Vista previa de la tarjeta */}
                    <div className="add-payment-method-credit-card-preview">
                        <div className={`add-payment-method-credit-card ${getCardType(cardData.numeroTarjeta).toLowerCase()}`}>
                            <div className="add-payment-method-card-number">
                                {cardData.numeroTarjeta || '**** **** **** ****'}
                            </div>
                            <div className="add-payment-method-card-info">
                                <div className="add-payment-method-card-holder">
                                    <span className="add-payment-method-label">TITULAR</span>
                                    <div>{cardData.nombreTitular || 'NOMBRE DEL TITULAR'}</div>
                                </div>
                                <div className="add-payment-method-card-expiry">
                                    <span className="add-payment-method-label">VENCE</span>
                                    <div>{cardData.fechaVencimiento || 'MM/YY'}</div>
                                </div>
                            </div>
                            <div className="add-payment-method-card-type">
                                {getCardType(cardData.numeroTarjeta)}
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="add-payment-method-payment-form">
                        <div className="add-payment-method-form-group">
                            <label htmlFor="numeroTarjeta">Número de la tarjeta</label>
                            <input
                                type="text"
                                id="numeroTarjeta"
                                name="numeroTarjeta"
                                value={cardData.numeroTarjeta}
                                onChange={handleInputChange}
                                className={errors.numeroTarjeta ? 'error' : ''}
                            />
                            {errors.numeroTarjeta && <span className="add-payment-method-error-message">{errors.numeroTarjeta}</span>}
                        </div>

                        <div className="add-payment-method-form-group">
                            <label htmlFor="nombreTitular">Nombre</label>
                            <input
                                type="text"
                                id="nombreTitular"
                                name="nombreTitular"
                                value={cardData.nombreTitular}
                                onChange={handleInputChange}
                                className={errors.nombreTitular ? 'error' : ''}
                            />
                            {errors.nombreTitular && <span className="add-payment-method-error-message">{errors.nombreTitular}</span>}
                        </div>

                        <div className="add-payment-method-form-row">
                            <div className="add-payment-method-form-group">
                                <label htmlFor="fechaVencimiento">Fecha de expiración</label>
                                <input
                                    type="text"
                                    id="fechaVencimiento"
                                    name="fechaVencimiento"
                                    value={cardData.fechaVencimiento}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className={errors.fechaVencimiento ? 'error' : ''}
                                />
                                {errors.fechaVencimiento && <span className="add-payment-method-error-message">{errors.fechaVencimiento}</span>}
                            </div>

                            <div className="add-payment-method-form-group">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={cardData.cvv}
                                    onChange={handleInputChange}
                                    className={errors.cvv ? 'error' : ''}
                                />
                                {errors.cvv && <span className="add-payment-method-error-message">{errors.cvv}</span>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="add-payment-method-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Agregando...' : 'Agregar Tarjeta'}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default AddPaymentMethodPage;