import './styles/PaymentMethodCard.css';

const PaymentMethodCard = ({ paymentMethod, onRemove }) => {

    const handleRemove = () => {
        onRemove(paymentMethod.id);
    };

    const formatCardNumber = (cardNumber) => {
        if (!cardNumber) return '**** **** **** ****';
        const last4 = cardNumber.slice(-4);
        return `**** **** **** ${last4}`;
    };


    return (
        <>
            <div className="payment-method-card">
                <p>{formatCardNumber(paymentMethod.numeroTarjeta)}</p>
                <button className="remove-button" onClick={handleRemove}>
                    Eliminar 🗑️
                </button>
            </div>
        </>
        
    );
}

export default PaymentMethodCard;