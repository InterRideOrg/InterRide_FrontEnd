import { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Divider, CircularProgress
} from '@mui/material';

import AuthLayout from '../../components/layout/AuthLayout';
import MainLayout from '../../components/layout/MainLayout';
import axiosProtected from '../../interceptors/axiosInstance';

export default function PassengerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDriverNotifications = async () => {
      try {
        // Step 1: Get conductorId using userId
        const profileRes = await axiosProtected.get(`/usuario/profile/PassengerId/${userId}`);
        const pasajeroId = profileRes.data;

        // Step 2: Fetch notifications with order=desc
        const notiRes = await axiosProtected.get(
          `/notificaciones/pasajero/${pasajeroId}?orden=desc`
        );

        setNotifications(notiRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Error al obtener notificaciones');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDriverNotifications();
  }, [userId]);

  const unread = notifications.filter(n => !n.leido);
  const read   = notifications.filter(n => n.leido);

  const renderNotification = (n, i) => (
    <Box key={i} sx={{ p: 2, bgcolor: n.leido ? '#f0f0f0' : '#fff3cd', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="body1">{n.mensaje}</Typography>
      <Typography variant="caption" color="text.secondary">{n.fechaHora}</Typography>
    </Box>
  );

  return (
    <MainLayout title="Tus Notificaciones">
      <Box sx={{ p: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack spacing={3}>
            {unread.length > 0 && (
              <>
                <Typography variant="h6">No leídas</Typography>
                <Stack spacing={2}>
                  {unread.map(renderNotification)}
                </Stack>
              </>
            )}

            {read.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Leídas</Typography>
                <Stack spacing={2}>
                  {read.map(renderNotification)}
                </Stack>
              </>
            )}

            {notifications.length === 0 && (
              <Typography>No tienes notificaciones aún.</Typography>
            )}
          </Stack>
        )}
      </Box>
    </MainLayout  >
  );
}
