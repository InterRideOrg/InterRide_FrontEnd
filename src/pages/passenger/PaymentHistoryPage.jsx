import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import CompletePaymentCard from "../../components/cards/CompletePaymentCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './styles/PaymentHistoryPage.css'; 

const PaymentHistoryPage = () => {
  const { pasajeroId } = useParams();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Calcular el total de páginas
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

  // Calcular los índices para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = paymentHistory.slice(startIndex, endIndex);

  // Funciones para cambiar de página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axiosInstance.get(`/pagos/completados/pasajero/${pasajeroId}`);
        setPaymentHistory(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchPaymentHistory();
  }, [pasajeroId]);

  // Reiniciar a la primera página cuando cambien los datos
  useEffect(() => {
    setCurrentPage(1);
  }, [paymentHistory]);

  return (
    <>
      <MainNavbar />
      <section className="payment-history-page-sec">
        <h1>Historial de Pagos</h1>
        
        {paymentHistory.length > 0 ? (
          <>
            {/* Lista de pagos de la página actual */}
            <div className="payment-history-list">
              {currentPayments.map((payment, index) => (
                <CompletePaymentCard key={payment.id || index} payment={payment} />
              ))}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  &larr; Anterior
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Siguiente &rarr;
                </button>
              </div>
            )}

            {/* Información de paginación */}
            <div className="pagination-info">
              <p>
                Mostrando {startIndex + 1} - {Math.min(endIndex, paymentHistory.length)} de {paymentHistory.length} pagos
              </p>
            </div>
          </>
        ) : (
          <p>No se encontraron pagos en el historial.</p>
        )}
      </section>
    </>
  );
};

export default PaymentHistoryPage;