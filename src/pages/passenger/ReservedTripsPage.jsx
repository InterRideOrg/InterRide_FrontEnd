import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainNavbar from "../../components/navigation/MainNavbar";
import axiosInstance from "../../interceptors/axiosInstance";
import TicketReservedCard from "../../components/cards/TicketReservedCard";
import './styles/ReservedTripsPage.css';

const ReservedTripsPage = () => {
  const { pasajeroId } = useParams();
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get(`/boletos/${pasajeroId}?state=SOLICITADO`);
        const response2 = await axiosInstance.get(`/boletos/${pasajeroId}?state=ACEPTADO`);
        setTickets([...response.data, ...response2.data]);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [pasajeroId]);

  return (
    <>
      <MainNavbar />
      <section className="reserved-trips-page">
        <div className="reserved-trips-page-title">
          <h2>Viajes Solicitados</h2>
        </div>
        <div className="reserved-trips-page-content">
          {tickets && tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <TicketReservedCard key={ticket.boletoId} ticket={ticket} />
                        ))
                    ) : (
                        <p>No se encontraron viajes para mostrar.</p>
                    )}
        </div>
      </section>
    </>
  );
};

export default ReservedTripsPage;
