import { CustomSnackbar } from '@bookify-v1/shared-components';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useCalendarActions } from './Calendar/useCalendarActions';

// Helper function to extract query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const BookingConfirmation: React.FC = () => {
  const query = useQuery();
  const { bookAppointment } = useCalendarActions();
  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // New state to track booking confirmation
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Get query parameters from the URL
  const providerId = query.get('providerId');
  const serviceId = query.get('serviceId');
  const date = query.get('date');
  const time = query.get('time');

  // Get userId from authSlice 
  const userId = useSelector((state: RootState) => state.auth.user.userId);

  const providers = useSelector((state: RootState) => state.provider.providers);
  const services = useSelector((state: RootState) => state.service.services);

  // Use the providerId and serviceId to find names
  const providerName = providers
    .find(p => p._id === providerId) 
    ? `${providers.find(p => p._id === providerId)?.firstName} ${providers.find(p => p._id === providerId)?.lastName}`
    : 'Unknown Provider';

  const serviceName = services.find(s => s._id === serviceId)?.name;

  const handleConfirmBooking = async () => {
    if (providerId && serviceId && date && time && userId) {
      const response = await bookAppointment(userId, providerId, serviceId, date, time);
      if (response.success) {
        setSnackbarMessage('Booking confirmed!');
        setSnackbarSeverity('success');
        setIsBookingConfirmed(true);  // Booking confirmed, show Home button
      } else {
        setSnackbarMessage(response.error || 'Failed to confirm booking.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Missing booking details.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle navigating to home
  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box 
        mt={6} 
        mb={4} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
          <Grid container spacing={2} justifyContent="center" textAlign="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Provider:</strong> {providerName || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Service:</strong> {serviceName || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Date:</strong> {date || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Time:</strong> {time || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            {isBookingConfirmed ? (
              // Show "Home" button after booking confirmation
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNavigateHome}
                sx={{
                  minWidth: '200px',
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Home
              </Button>
            ) : (
              // Show "Confirm Booking" button before booking is confirmed
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleConfirmBooking}
                sx={{
                  minWidth: '200px',
                  py: 1.5,
                  bgcolor: 'secondary.main',
                  fontWeight: 'bold',
                }}
              >
                Confirm Booking
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Snackbar for success/error feedback */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default BookingConfirmation;
