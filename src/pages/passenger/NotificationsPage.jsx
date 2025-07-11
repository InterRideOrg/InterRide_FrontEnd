import { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Divider, CircularProgress,
  Card, CardContent, Chip, Avatar, Badge, Alert,
  Container, Paper, Fade, useTheme, useMediaQuery,
  Pagination, PaginationItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  DirectionsCar as CarIcon,
  Schedule as ScheduleIcon,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

import MainLayout from '../../components/layout/MainLayout';
import axiosProtected from '../../interceptors/axiosInstance';

export default function PassengerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [unreadPage, setUnreadPage] = useState(1);
  const [readPage, setReadPage] = useState(1);
  const itemsPerPage = 8;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDriverNotifications = async () => {
      try {
        const profileRes = await axiosProtected.get(`/usuario/profile/PassengerId/${userId}`);
        const pasajeroId = profileRes.data;

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
  const read = notifications.filter(n => n.leido);

  // 🔢 Cálculos de paginación
  const totalUnreadPages = Math.ceil(unread.length / itemsPerPage);
  const totalReadPages = Math.ceil(read.length / itemsPerPage);

  // 📋 Obtener items de la página actual
  const getCurrentUnread = () => {
    const startIndex = (unreadPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return unread.slice(startIndex, endIndex);
  };

  const getCurrentRead = () => {
    const startIndex = (readPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return read.slice(startIndex, endIndex);
  };

  // 🔄 Handlers de paginación
  const handleUnreadPageChange = (event, page) => {
    setUnreadPage(page);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadPageChange = (event, page) => {
    setReadPage(page);
    // Scroll suave hacia la sección de leídas
    const readSection = document.getElementById('read-section');
    if (readSection) {
      readSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNotificationStyle = (mensaje) => {
    if (mensaje.includes('cancelado')) {
      return { 
        icon: <CancelIcon />, 
        color: 'error', 
        bgColor: '#ffebee',
        borderColor: '#f44336',
        emoji: '❌'
      };
    }
    if (mensaje.includes('confirmado') || mensaje.includes('aceptado')) {
      return { 
        icon: <CheckCircleIcon />, 
        color: 'success', 
        bgColor: '#e8f5e8',
        borderColor: '#4caf50',
        emoji: '✅'
      };
    }
    if (mensaje.includes('viaje') || mensaje.includes('boleto')) {
      return { 
        icon: <CarIcon />, 
        color: 'primary', 
        bgColor: '#e3f2fd',
        borderColor: '#2196f3',
        emoji: '🚗'
      };
    }
    return { 
      icon: <InfoIcon />, 
      color: 'info', 
      bgColor: '#f3e5f5',
      borderColor: '#9c27b0',
      emoji: '💬'
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else if (diffInHours < 168) {
      return `Hace ${Math.floor(diffInHours / 24)} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: isMobile ? 'short' : 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderNotification = (n, i) => {
    const style = getNotificationStyle(n.mensaje);
    
    return (
      <Fade in={true} timeout={300 + i * 100} key={i}>
        <Card 
          elevation={n.leido ? 1 : 4}
          sx={{ 
            borderLeft: `${isMobile ? '4px' : '6px'} solid ${style.borderColor}`,
            backgroundColor: n.leido ? '#fafafa' : style.bgColor,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: isMobile ? 'none' : 'translateY(-2px)',
              boxShadow: isMobile ? 1 : 6
            }
          }}
        >
          <CardContent sx={{ 
            p: isMobile ? 2 : 3,
            '&:last-child': { pb: isMobile ? 2 : 3 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: isMobile ? 1.5 : 2,
              flexDirection: isMobile && !isTablet ? 'column' : 'row'
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: style.borderColor,
                  width: isMobile ? 40 : 50,
                  height: isMobile ? 40 : 50,
                  fontSize: isMobile ? '1.2rem' : '1.5rem',
                  alignSelf: isMobile && !isTablet ? 'center' : 'flex-start'
                }}
              >
                {style.emoji}
              </Avatar>
              
              <Box sx={{ flex: 1, width: '100%' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: 1,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }}>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"}
                    sx={{ 
                      fontWeight: n.leido ? 400 : 600,
                      color: n.leido ? 'text.secondary' : 'text.primary',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                      flex: 1
                    }}
                  >
                    {n.mensaje}
                  </Typography>
                  
                  
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mt: 2,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontWeight: 500, fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                    >
                      {formatDate(n.fechaHora)}
                    </Typography>
                  </Box>
                  
                  
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // 📊 Componente de información de paginación
  const PaginationInfo = ({ current, total}) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2,
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 1 : 0
    }}>
      <Typography variant="body2" color="text.secondary">
        Mostrando {Math.min(itemsPerPage, total - (current - 1) * itemsPerPage)} de {total} notificaciones
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Página {current} de {Math.ceil(total / itemsPerPage)}
      </Typography>
    </Box>
  );

  return (
    <MainLayout title={isMobile ? "📢 Notificaciones" : "📢 Centro de Notificaciones"}>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3
        }}
      >
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: isMobile ? 200 : 300 
          }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                color="text.secondary"
                textAlign="center"
              >
                Cargando tus notificaciones...
              </Typography>
            </Stack>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ 
              borderRadius: 3, 
              fontSize: isMobile ? '0.9rem' : '1.1rem' 
            }}
          >
            {error}
          </Alert>
        ) : (
          <Stack spacing={isMobile ? 3 : 4}>
            

            {/* Notificaciones no leídas */}
            {unread.length > 0 && (
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: isMobile ? 1.5 : 2, 
                  mb: 3,
                  flexWrap: 'wrap'
                }}>
                  <NotificationsActiveIcon sx={{ 
                    color: 'primary.main', 
                    fontSize: isMobile ? 24 : 28 
                  }} />
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    sx={{ fontWeight: 700, color: 'primary.main' }}
                  >
                   {isMobile ? "Notificaciones" : "Notificaciones"}
                  </Typography>
                </Box>

                {/* Info de paginación no leídas */}
                <PaginationInfo 
                  current={unreadPage} 
                  total={unread.length} 
                  type="no leídas" 
                />

                <Stack spacing={isMobile ? 1.5 : 2}>
                  {getCurrentUnread().map(renderNotification)}
                </Stack>

                {/* Paginación no leídas */}
                {totalUnreadPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3 
                  }}>
                    <Pagination
                      count={totalUnreadPages}
                      page={unreadPage}
                      onChange={handleUnreadPageChange}
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                      showFirstButton
                      showLastButton
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{ 
                            previous: ArrowBack, 
                            next: ArrowForward 
                          }}
                          {...item}
                        />
                      )}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Notificaciones leídas */}
            {read.length > 0 && (
              <Box id="read-section">
                <Divider sx={{ my: isMobile ? 3 : 4 }}>
                  <Chip 
                    label="📖 Notificaciones Anteriores" 
                    variant="outlined" 
                    sx={{ 
                      fontSize: isMobile ? '0.8rem' : '1rem', 
                      py: isMobile ? 1.5 : 2, 
                      px: isMobile ? 2 : 3 
                    }}
                  />
                </Divider>

                {/* Info de paginación leídas */}
                <PaginationInfo 
                  current={readPage} 
                  total={read.length} 
                  type="leídas" 
                />
                
                <Stack spacing={isMobile ? 1.5 : 2}>
                  {getCurrentRead().map(renderNotification)}
                </Stack>

                {/* Paginación leídas */}
                {totalReadPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3 
                  }}>
                    <Pagination
                      count={totalReadPages}
                      page={readPage}
                      onChange={handleReadPageChange}
                      color="secondary"
                      size={isMobile ? "medium" : "large"}
                      showFirstButton
                      showLastButton
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{ 
                            previous: ArrowBack, 
                            next: ArrowForward 
                          }}
                          {...item}
                        />
                      )}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Estado vacío */}
            {notifications.length === 0 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: isMobile ? 4 : 6, 
                  textAlign: 'center', 
                  borderRadius: 4,
                  bgcolor: 'grey.50',
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <NotificationsIcon sx={{ 
                  fontSize: isMobile ? 60 : 80, 
                  color: 'grey.400', 
                  mb: 2 
                }} />
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ fontWeight: 600, mb: 2, color: 'grey.600' }}
                >
                  📭 No hay notificaciones
                </Typography>
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="text.secondary"
                >
                  Cuando tengas nuevas actualizaciones aparecerán aquí
                </Typography>
              </Paper>
            )}
          </Stack>
        )}
      </Container>
    </MainLayout>
  );
}