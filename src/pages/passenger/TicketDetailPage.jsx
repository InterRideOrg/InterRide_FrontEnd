import { useParams } from "react-router-dom";
import MainNavbar from "../../components/navigation/MainNavbar";
import { useEffect, useState   } from "react";
import dayjs from "dayjs";

import axiosInstance from "../../interceptors/axiosInstance";
import Rating from '@mui/material/Rating';

import './styles/TicketDetailPage.css';


const TicketDetailPage = () => {
    const { pasajeroId, viajeId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [calification, setCalificacion ] = useState(null);
    const [driver, setDriver] = useState(null);


    useEffect(() => {
        axiosInstance.get(`/boletos/${pasajeroId}/${viajeId}`)
            .then(response => {
                setTicket(response.data);
            })
            .catch(error => {
                console.error('Error fetching ticket details:', error);
            });
    }, [pasajeroId, viajeId]);

    useEffect(() => {
        axiosInstance.get(`/calificaciones/${pasajeroId}/${viajeId}`)
            .then(response => {
                setCalificacion(response.data);
            })
            .catch(error => {
                console.error('Error fetching ticket details:', error);
            });
    }, [pasajeroId, viajeId]);

    useEffect(() => {
        if (calification && calification.conductorId) {
            axiosInstance.get(`/usuario/profile/conductor/${calification.conductorId}`)
                .then(response => {
                    setDriver(response.data);
                })
                .catch(error => {
                    console.error('Error fetching driver details:', error);
                });
        }
    }, [calification]);

    return (
        <>
            <MainNavbar />
            <section className="sec-ticket-detail">
                <div className="tittle">
                    <h1>Historial de viajes</h1>
                </div>
                <div className="ticket-detail-header">
                        <p>{ticket? ticket.provinciaDestino : "Sin destino"}</p>
                        <p>Informacion del viaje</p>
                    </div>
                <div className="ticket-detail">
                    <div className="ticket-detail-info">
                        <div className="ticket-detail-info-driverANDprice">
                            <div className="ticket-detail-info-driver">
                                <p>CONDUCTOR</p>
                                <p>{driver ? driver.nombre : "name"} {driver? driver.apellidos : "lastname"}</p>
                            </div>
                            <div className="ticket-detail-info-price">
                                <p>PRECIO</p>
                                <p>{ticket ? ticket.costo : "price"} PEN</p>
                            </div>
                        </div>
                        <div className="ticket-detail-info-dates">
                            <p>TRAYECTO</p>
                            <p>Salida: {ticket ? dayjs(ticket.fechaHoraPartida).format("DD/MM/YYYY - HH:mm") : "start"} </p>
                            <p>Llegada: {ticket? dayjs(ticket.fechaHoraLlegada).format("DD/MM/YYYY - HH:mm") : "end"} </p>
                        </div>
                        <div className="ticket-calification">
                            <div className="ticket-calification-stars">
                                <span>CALIFICACIÓN</span>
                                <span className="stars-right">
                                    <Rating
                                        readOnly
                                        name="size-small"
                                        value={calification ? Math.round(Number(calification.estrellas)) : 0}
                                        size="small"
                                    />
                                </span>
                        
                            </div>
                            <div className="ticket-calification-comment">
                                <p>
                                    {calification ? calification.comentario : "Comentario"}
                                </p>

                            </div>
                        </div>

                    </div>
                    
                </div>
                

                
            </section>
        </>
        
    );
}

export default TicketDetailPage;