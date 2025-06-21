import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import TripCard from '../../components/cards/TripCard';
import { useDriverRequests } from '../../hooks/useDriverRequests';

export default function DriverHome() {
  const { ongoing, requests, completed } = useDriverRequests();

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Hola, Madison</Typography>
      <Typography color="text.secondary">Es hora de un nuevo viaje.</Typography>

      {/* viaje en curso */}
      <Section title="Viaje En Curso">
        {ongoing ? (
          <TripCard trip={ongoing} variant="teal" />
        ) : (
          <EmptyState>No hay viaje en curso.</EmptyState>
        )}
      </Section>

      {/* solicitudes */}
      <Section
        title="Solicitudes de Viajes"
        action={<Link to="/driver/requests">Ver Todos</Link>}
      >
        {requests.slice(0, 2).map(t => (
          <TripCard trip={t} key={t.id} variant="primary" />
        ))}
      </Section>

      {/* completados */}
      <Section
        title="Viajes Completados"
        action={<Link to="/driver/completed">Ver Todos</Link>}
      >
        {completed.length === 0 && <EmptyState>Aún no hay viajes.</EmptyState>}
      </Section>
    </Stack>
  );
}
