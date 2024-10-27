import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAppointmentsAsync, selectAppointmentError, selectAppointments, selectLoadingState } from '../store/appointment.slice';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import AppointmentList from '../components/AppointmentList';

const AppointmentContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const appointments = useSelector((state: RootState) => selectAppointments(state));
  const loading = useSelector((state: RootState) => selectLoadingState(state));
  const error = useSelector((state: RootState) => selectAppointmentError(state));

  useEffect(() => {
    // Fetch appointments with hardcoded date range
    dispatch(fetchAppointmentsAsync());
  }, [dispatch]);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <AppointmentList appointments={appointments} />
      )}
    </Box>
  );
};

export default AppointmentContainer;
