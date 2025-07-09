import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../interceptors/axiosInstance";
import MainFilter from "../../components/filters/Mainfilter";
import MainNavbar from "../../components/navigation/MainNavbar";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import "../passenger/styles/HistoryPage.css";

// Tarjeta simple para cada viaje completado
function CompletedTripCard({ ticket, onClick }) {
  return (
    <div
      style={{
        background: "#456977",
        color: "white",
        borderRadius: 16,
        padding: "18px 28px",
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div>
        <div style={{ fontWeight: 500 }}>
          Fecha: {dayjs(ticket.fechaHoraPartida).locale('es').format("DD [de] MMMM")}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Hora: {dayjs(ticket.fechaHoraPartida).format("HH:mm") || "15:26"}
        </div>
      </div>
      <div style={{ fontSize: 15, opacity: 0.8 }}>
        Detalle &rarr;
      </div>
    </div>
  );
}

const DriverHistoryPage = () => {
  const [timeFrom, setTimeFrom] = useState(dayjs());
  const [timeTo, setTimeTo] = useState(dayjs());
  const [date, setDate] = useState(dayjs());
  const [province, setProvince] = useState("");
  const [tickets, setTickets] = useState(null);
  const navigate = useNavigate();

  const { driverId } = useParams(); 


  useEffect(() => {
    axiosInstance
      .get(`/trips/viajesCompletados/${driverId}`) // Endpoint para obtener viajes completados del conductor
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [driverId]);

  // Agrupación de viajes por semana (ejemplo simple)
  const groupTicketsByWeek = (tickets) => {
    if (!tickets) return {};
    const thisWeek = [];
    const lastWeek = [];
    const now = dayjs();
    tickets.forEach((ticket) => {
      const ticketDate = dayjs(ticket.fecha);
      if (now.diff(ticketDate, "week") === 0) {
        thisWeek.push(ticket);
      } else if (now.diff(ticketDate, "week") === 1) {
        lastWeek.push(ticket);
      }
    });
    return { thisWeek, lastWeek };
  };

  const { thisWeek, lastWeek } = groupTicketsByWeek(tickets);

  return (
    <section className="history-page-sec-history">
      <div className="history-page-principal">
        <div className="history-page-title">
          <h2>Viajes Completados</h2>
          <p>Consulta el historial de viajes realizados.</p>
        </div>
        <div>
          <MainFilter
            timeFrom={timeFrom}
            setTimeFrom={setTimeFrom}
            timeTo={timeTo}
            setTimeTo={setTimeTo}
            date={date}
            setDate={setDate}
            province={province}
            setProvince={setProvince}
          />
        </div>
      </div>
      <div className="history-page-history">
        {/* Esta Semana */}
        <div>
          <h4 style={{ margin: "24px 0 12px 0" }}>ESTA SEMANA</h4>
          {thisWeek && thisWeek.length > 0 ? (
            thisWeek.map((ticket) => (
              <CompletedTripCard
                key={ticket.idViaje || ticket.boletoId}
                ticket={ticket}
                onClick={() => navigate(`/driver/trip/${driverId}/${ticket.idViaje}`)}
              />
            ))
          ) : (
            <p>No hay viajes completados esta semana.</p>
          )}
        </div>
        {/* Hace 1 semana */}
        <div>
          <h4 style={{ margin: "24px 0 12px 0" }}>HACE 1 SEMANA(S)</h4>
          {lastWeek && lastWeek.length > 0 ? (
            lastWeek.map((ticket) => (
              <CompletedTripCard
                key={ticket.viajeId || ticket.boletoId}
                ticket={ticket}
                onClick={() => navigate(`/driver/trip/${ticket.viajeId}`)}
              />
            ))
          ) : (
            <p>No hay viajes completados la semana pasada.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DriverHistoryPage;