import { useState, useEffect} from "react"
import axiosInstance from "../../interceptors/axiosInstance"
import MainFilter from "../../components/filters/mainfilter"
import MainNavbar from "../../components/navigation/MainNavbar"
import TicketCardHistory from "../../components/cards/TicketCardHistory"
import dayjs from "dayjs"
import './styles/HistoryPage.css'

const HistoryPage = () => {
    const [timeFrom, setTimeFrom] = useState(dayjs())
    const [timeTo, setTimeTo] = useState(dayjs())
    const [date, setDate] = useState(dayjs())
    const [province, setProvince] = useState("")
    const [tickets, setTickets] = useState(null)

    useEffect(() => {
        axiosInstance.get('/boletos/1?state=COMPLETADO')
        .then(response => {
            setTickets(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        
    }, []);


    return (
        <>
            <MainNavbar />
            <section className="sec-history">
                <div className="principal">
                    <div className="title">
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
                <div className="history">
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

export default HistoryPage
