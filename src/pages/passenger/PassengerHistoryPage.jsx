import { useState, useEffect, useMemo } from "react"
import axiosInstance from "../../interceptors/axiosInstance"
import MainFilter from "../../components/filters/MainFilter"
import MainNavbar from "../../components/navigation/MainNavbar"
import TicketCardHistory from "../../components/cards/TicketCardHistory"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import './styles/HistoryPage.css'

const PassengerHistoryPage = () => {
    const [dateFrom, setDateFrom] = useState(null)
    const [dateTo, setDateTo] = useState(null)
    //const [province, setProvince] = useState("")
    const [tickets, setTickets] = useState([])

    const { pasajeroId } = useParams();

    useEffect(() => {
        axiosInstance.get(`/boletos/${pasajeroId}?state=COMPLETADO`)
        .then(response => {
            setTickets(response.data);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        
    }, [pasajeroId]);

    const filteredTickets = useMemo(() => {
        if (!tickets) return null;

        return tickets.filter(ticket => {
            const fechaPartida = dayjs(ticket.fechaHoraPartida);
            
            if (dateFrom && fechaPartida.isBefore(dateFrom, 'day')) {
                return false;
            }
            
            if (dateTo && fechaPartida.isAfter(dateTo, 'day')) {
                return false;
            }
            
            return true;
        });
    }, [tickets, dateFrom, dateTo]);

    return (
        <>
            <MainNavbar />
            <section className="history-page-sec-history">
                <div className="history-page-principal">
                    <div className="history-page-title">
                        <h2>Historial de Viajes</h2>
                        <p>Consulta el historial de viajes realizados.</p>
                    </div>
                    
                    <div>
                        <MainFilter
                            dateFrom={dateFrom}
                            setDateFrom={setDateFrom}
                            dateTo={dateTo}
                            setDateTo={setDateTo}
                        />
                    </div>

                    
                </div>
                <div className="history-page-history">
                    {filteredTickets && filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <TicketCardHistory key={ticket.boletoId} ticket={ticket} />
                        ))
                    ) : (
                        <p>No se encontraron viajes en el historial.</p>
                    )}
                </div>
            </section>
        </>
    )
}

export default PassengerHistoryPage