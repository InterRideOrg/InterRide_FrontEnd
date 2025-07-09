import { useState, useEffect} from "react"
import axiosInstance from "../../interceptors/axiosInstance"
import MainFilter from "../../components/filters/Mainfilter"
import MainNavbar from "../../components/navigation/MainNavbar"
import TicketCardHistory from "../../components/cards/TicketCardHistory"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import './styles/HistoryPage.css'

const PassengerHistoryPage = () => {
    const [timeFrom, setTimeFrom] = useState(dayjs())
    const [timeTo, setTimeTo] = useState(dayjs())
    const [date, setDate] = useState(dayjs())
    const [province, setProvince] = useState("")
    const [tickets, setTickets] = useState(null)
 
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
                    {tickets && tickets.length > 0 ? (
                        tickets.map(ticket => (
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