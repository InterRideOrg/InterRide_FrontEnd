import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './styles/ReservedTripDetailPage.css'; // Asegúrate de tener este archivo CSS

const ReservedTripDetailPage = () => {
  const { pasajeroId, boletoId } = useParams();
  const [ ticket, setTicket ] = useState(null);
  const [ driver, setDriver ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axiosInstance.get(`/boletos/${pasajeroId}/${boletoId}`);
        setTicket(response.data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    };

    fetchTicket();
  }, [pasajeroId, boletoId]);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        if (!ticket || !ticket.conductorId) return; 

        const response = await axiosInstance.get(`/usuario/profile/conductor/${ticket.conductorId}`);
        setDriver(response.data);
      } catch (error) {
        console.error('Error fetching driver:', error);
      }
    };

    fetchDriver();
  }, [ticket]);

  
  const handleCancelReservation = async () => {
    try {
      const confirm = window.confirm("¿Estás seguro de que deseas cancelar esta reserva?");
      if (!confirm) return;

      await axiosInstance.put(`/boletos/${ticket.boletoId}/cancelar`);
      alert("Reserva cancelada exitosamente.");
      navigate(`/passenger/requested-trips/${pasajeroId}`); // Redirigir a la lista de viajes reservados

      // Aquí podrías redirigir al usuario a otra página, por ejemplo, la lista de viajes reservados
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert(error.response?.data?.detail || "Error al cancelar la reserva. Inténtalo de nuevo.");
    }
  };

  const handleBoardReservation = async () => {
    try {
      const confirm = window.confirm("¿Estás seguro de que desea abordar?");
      if (!confirm) return;

      await axiosInstance.put(`/boletos/${pasajeroId}/${ticket.viajeId}/abordar`);
      alert("Ya estas listo para tu viaje!");
      navigate(`/passenger/home/${pasajeroId}`);

    } catch (error) {
      console.error('Error boarding trip:', error);
      alert(error.response?.data?.detail || "Error al abordar el viaje. Inténtalo de nuevo.");
    }

  }


  return (
    <>
      <MainNavbar />
      <section className="reserved-trip-detail-page">
        <div className="reserved-trip-detail-page-title">
          <h2>Detalle del Viaje</h2>
        </div>
        <div className="reserved-trip-detail-page-content">
          {ticket ? (
            <div className="ticket-reserved-detail-info">
              <h3>Información del Boleto</h3>
              <p><strong>Fecha y Hora de Partida:</strong> {new Date(ticket.fechaHoraPartida).toLocaleString()}</p>
              <p><strong>Fecha y Hora de Llegada:</strong> {new Date(ticket.fechaHoraLlegada).toLocaleString()}</p>
              <p><strong>Estado:</strong> {ticket.estado}</p>
              <p><strong>Costo:</strong> {ticket.costo} PEN</p>
              <p><strong>Asientos Ocupados:</strong> {ticket.asientosOcupados}</p>
              <p><strong>Origen:</strong> {ticket.provinciaOrigen} - {ticket.direccionPartida}</p>
              <p><strong>Destino:</strong> {ticket.provinciaDestino} - {ticket.direccionDestino}</p>
              <h4>Información del Conductor</h4>
              {driver ? (
                <p><strong>Nombre:</strong> {driver.nombre} {driver.apellidos}</p>
              ): <p>Sin conductor</p>}
            </div>
          ) : (
            <p>Cargando información del boleto...</p>
          )}
          
        </div>
        <div className="reserved-trip-detail-page-actions">
          <button className="btn-cancel" onClick={handleCancelReservation}>Cancelar Reserva</button>
          <button className="btn-board" onClick={handleBoardReservation}>Abordar Viaje</button>
        </div>
      </section>
    </>
  );
};

export default ReservedTripDetailPage;
