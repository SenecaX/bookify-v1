import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAppointmentsAsync, selectAppointmentError, selectAppointments, selectLoadingState } from '../store/appointment.slice';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { IAppointment } from '../types';
import AppointmentList from '../components/AppointmentList';

// Function to find a user by ID in a list
const getUserFullName = (userId: string, users: Array<{ _id: string; firstName: string; lastName: string }>) => {
  const user = users.find(u => u._id === userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
};

const AppointmentContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const appointments = useSelector<RootState, IAppointment[]>(selectAppointments);
  const loading = useSelector<RootState, boolean>(selectLoadingState);
  const error = useSelector<RootState, string | null>(selectAppointmentError);

  // Retrieve provider and customer data from state
  const providers = useSelector((state: RootState) => state.provider.providers);
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("user", user)

  useEffect(() => {
    // Fetch appointments with hardcoded date range
    dispatch(fetchAppointmentsAsync());
  }, [dispatch]);

  // Map appointments with provider and customer names
  const appointmentsWithNames = appointments.map((appointment) => ({
    ...appointment,
    providerName: getUserFullName(
        appointment.providerId,
        providers as Array<{ _id: string; firstName: string; lastName: string }>
      ),
    customerName: user?.userId === appointment.customerId ? `${user.firstName} ${user.lastName}` : 'Unknown',
    dateTime: appointment.dateTime instanceof Date ? appointment.dateTime.toISOString() : appointment.dateTime,
    endTime: appointment.endTime instanceof Date ? appointment.endTime.toISOString() : appointment.endTime,
    createdAt: appointment.createdAt instanceof Date ? appointment.createdAt.toISOString() : appointment.createdAt
 
  }));

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <AppointmentList appointments={appointmentsWithNames} />
      )}
    </Box>
  );
};

export default AppointmentContainer;
