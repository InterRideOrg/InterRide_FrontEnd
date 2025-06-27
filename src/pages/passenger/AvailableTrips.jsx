import MainNavbar from "../../components/navigation/MainNavbar";
import MainFilter from "../../components/filters/mainfilter";
import {useEffect, useState} from "react";
import axiosInstance from "../../interceptors/axiosInstance";
import AvailableTripCard from "../../components/cards/AvailableTripCard";
import dayjs from "dayjs";
import './styles/AvailableTripsPage.css';


const AvailableTrips = () => {
    const [timeFrom, setTimeFrom] = useState(dayjs());
    const [timeTo, setTimeTo] = useState(dayjs());
    const [date, setDate] = useState(dayjs());
    const [province, setProvince] = useState("");
    const [trips, setTrips] = useState(null);

    useEffect(() => {
        axiosInstance.get('/trips/viajesDisponibles')
        .then(response => {
            setTrips(response.data);
        })
        .catch(error => {
            console.error('Error fetching available trips:', error);
        });
    }, []);


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

                <div className="available-trips-history">
                        {trips && trips.length > 0 ? (
                            trips.map(trip => (
                                <AvailableTripCard key={trip.viajeId} trip={trip} />
                            ))
                        ) : (
                            <p>No se encontraron viajes disponibles en este momento.</p>
                        )}
                </div>


            </section>
                
        </>
    );
}

export default AvailableTrips;