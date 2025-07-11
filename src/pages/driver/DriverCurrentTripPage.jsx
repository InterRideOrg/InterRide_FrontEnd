import MainNavbar from '../../components/navigation/MainNavbar';
import axiosInstance from '../../interceptors/axiosInstance';
import TicketDestinyCard from '../../components/cards/TicketDestinyCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/DriverCurrentTripPage.css';

const DriverCurrentTripPage = () => {
  const { conductorId, viajeId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/boletos/viaje/${viajeId}`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Error al cargar los destinos del viaje');
      } finally {
        setLoading(false);
      }
    };

    if (viajeId) {
      fetchTickets();
    }
  }, [viajeId]);

  // filtros
  const ticketsEnCurso = tickets.filter(ticket => ticket.estado === 'EN_CURSO');
  const ticketsCompletados = tickets.filter(ticket => ticket.estado === 'COMPLETADO');
  const ticketsPendientes = tickets.filter(ticket => ticket.estado === 'PENDIENTE');

  // estadistica
  const totalPasajeros = tickets.reduce((sum, ticket) => sum + ticket.asientosOcupados, 0);
  const pasajerosAbordo = tickets.filter(ticket => ticket.abordo).reduce((sum, ticket) => sum + ticket.asientosOcupados, 0);

  // Determinar el título dinámicamente
  const getTitleAndIcon = () => {
    if (tickets.length === 0) {
      return { title: "Viaje Sin Pasajeros", icon: "🚗" };
    }
    
    if (ticketsEnCurso.length === 0 && ticketsCompletados.length > 0) {
      return { title: "", icon: "" };
    }
    
    if (ticketsEnCurso.length === 0 && ticketsPendientes.length > 0) {
      return { title: "Viaje Pendiente", icon: "⏳" };
    }
    
    return { title: "Viaje en Curso", icon: "🚗" };
  };

  const { title, icon } = getTitleAndIcon();

  if (loading) {
    return (
      <>
        <MainNavbar />
        <section className="driver-current-trip-page-sec">
          <div className="driver-current-trip-page-loading">
            <div className="driver-current-trip-page-spinner"></div>
            <p>Cargando información del viaje...</p>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainNavbar />
        <section className="driver-current-trip-page-sec">
          <div className="driver-current-trip-page-error">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button 
              className="driver-current-trip-page-retry-btn"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <section className="driver-current-trip-page-sec">
        <div className="driver-current-trip-page-header">
            {/* Mensaje especial cuando el viaje está completado */}
              {ticketsEnCurso.length === 0 && ticketsCompletados.length > 0 && (
                <div className="driver-current-trip-page-completion-message">
                  <div className="driver-current-trip-page-completion-card">
                    <h3>🎊 ¡Excelente trabajo!</h3>
                    <p>Has finalizado exitosamente todos los destinos de este viaje.</p>
                    <button 
                      className="driver-current-trip-page-new-trip-btn"
                      onClick={() => navigate(`/driver/home/${conductorId}`)}
                    >
                      Ir al inicio
                    </button>
                  </div>
                </div>
              )}
          
          <div className="driver-current-trip-page-title-container">
            <h1 className={`driver-current-trip-page-title ${ticketsEnCurso.length === 0 && ticketsCompletados.length > 0 ? 'completed' : ''}`}>
              {icon} {title}
            </h1>
            {ticketsEnCurso.length === 0 && ticketsCompletados.length > 0 && (
              <p className="driver-current-trip-page-subtitle">
                Has completado todos los destinos de este viaje
              </p>
            )}
          </div>
          
          {/* Estadísticas del viaje */}
          <div className="driver-current-trip-page-stats">
            <div className="driver-current-trip-page-stat-card">
              <span className="driver-current-trip-page-stat-number">{totalPasajeros}</span>
              <span className="driver-current-trip-page-stat-label">Total Pasajeros</span>
            </div>
            <div className="driver-current-trip-page-stat-card">
              <span className="driver-current-trip-page-stat-number">{pasajerosAbordo}</span>
              <span className="driver-current-trip-page-stat-label">A Bordo</span>
            </div>
            <div className="driver-current-trip-page-stat-card">
              <span className="driver-current-trip-page-stat-number">{tickets.length}</span>
              <span className="driver-current-trip-page-stat-label">Destinos</span>
            </div>
          </div>
        </div>

        <div className="driver-current-trip-page-content">
          {tickets.length === 0 ? (
            <div className="driver-current-trip-page-no-tickets">
              <h3>No hay destinos para este viaje</h3>
              <p>Aún no se han registrado pasajeros para este viaje.</p>
            </div>
          ) : (
            <>
              {/* Tickets en curso */}
              {ticketsEnCurso.length > 0 && (
                <div className="driver-current-trip-page-section">
                  <h3 className="driver-current-trip-page-section-title">
                    🚗 En Curso ({ticketsEnCurso.length})
                  </h3>
                  <div className="driver-current-trip-page-tickets">
                    {ticketsEnCurso.map(ticket => (
                      <TicketDestinyCard key={ticket.boletoId} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets pendientes */}
              {ticketsPendientes.length > 0 && (
                <div className="driver-current-trip-page-section">
                  <h3 className="driver-current-trip-page-section-title">
                    ⏳ Pendientes ({ticketsPendientes.length})
                  </h3>
                  <div className="driver-current-trip-page-tickets">
                    {ticketsPendientes.map(ticket => (
                      <TicketDestinyCard key={ticket.boletoId} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets completados */}
              {ticketsCompletados.length > 0 && (
                <div className="driver-current-trip-page-section">
                  <h3 className="driver-current-trip-page-section-title">
                    ✅ Completados ({ticketsCompletados.length})
                  </h3>
                  <div className="driver-current-trip-page-tickets">
                    {ticketsCompletados.map(ticket => (
                      <TicketDestinyCard key={ticket.boletoId} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}

              
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DriverCurrentTripPage;