// src/pages/driver/RequestsPage.jsx
import React, { useEffect, useState } from "react";
import "./styles/RequestsPage.css";
import dayjs from "dayjs";
import axiosInstance from "../../interceptors/axiosInstance";
import { Link } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";

export default function RequestsPage() {
  const [trips, setTrips] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get("/trips/viajesSolicitados");
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.fechaHoraPartida) - new Date(b.fechaHoraPartida);
    } else if (sortOption === "price") {
      return a.costo - b.costo;
    }
    return 0;
  });

  return (
    <Box className="requests-container">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Solicitudes De Viajes
      </Typography>

      <FormControl sx={{ minWidth: 200, mb: 4 }}>
        <InputLabel id="sort-label">Ordenar Por</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          label="Ordenar Por"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="date">Fecha</MenuItem>
          <MenuItem value="price">Precio</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {sortedTrips.map((trip) => (
          <Link
              key={trip.id}
              to={`/driver/requests/${trip.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
          >
              <div className="trip-card">
              <h3>
                  Viaje #{trip.id} - <span>{trip.estado}</span>
              </h3>
              <p>Fecha de partida: {dayjs(trip.fechaHoraPartida).format("YYYY-MM-DD HH:mm")}</p>
              <p>Origen: {trip.provinciaOrigen} ({trip.direccionOrigen})</p>
              <p>Destino: {trip.provinciaDestino} ({trip.direccionDestino})</p>
              <p>Asientos reservados: {trip.asientosReservados}</p>
              <p>Costo: S/. {trip.costo.toFixed(2)}</p>
              </div>
          </Link>
      ))}
      </Grid>
    </Box>
  );
}
