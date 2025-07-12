import MainNavbar from "../../components/navigation/MainNavbar";
import MainFilter from "../../components/filters/MainFilter";
import {useEffect, useState, useMemo } from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import AvailableTripCard from "../../components/cards/AvailableTripCard";
import dayjs from "dayjs";
import './styles/AvailableTripsPage.css';


const AvailableTrips = () => {
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    //const [province, setProvince] = useState("");
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        axiosInstance.get('/trips/viajesDisponibles')
        .then(response => {
            setTrips(response.data);
        })
        .catch(error => {
            console.error('Error fetching available trips:', error);
        });
    }, []);

    const filteredTrips = useMemo(() => {
        if (!trips) return null;

        return trips.filter(trip => {
            
            const fechaTrip = dayjs(trip.fechaHoraPartida);
            
            if (dateFrom && fechaTrip.isBefore(dateFrom, 'day')) {
                return false;
            }
            
            if (dateTo && fechaTrip.isAfter(dateTo, 'day')) {
                return false;
            }
            
            return true;
        });
    }, [trips, dateFrom, dateTo]);

    return (
        <>
            <MainNavbar />
            <section className="available-trips-sec-history">
                <div className="available-trips-principal">
                    <div className="available-trips-title">
                        <h2>Viajes Disponibles</h2>
                        <p>Consulta los viajes disponibles.</p>
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

                <div className="available-trips-history">
                    {filteredTrips && filteredTrips.length > 0 ? (
                        filteredTrips.map(trip => (
                            <AvailableTripCard key={trip.viajeId} trip={trip} />
                        ))
                    ) : (
                        <p>No se encontraron viajes disponibles para las fechas seleccionadas.</p>
                    )}
                </div>


            </section>
                
        </>
    );
}

export default AvailableTrips;