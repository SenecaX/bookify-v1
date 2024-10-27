import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAppointmentsAsync, selectAppointmentError, selectAppointments, selectLoadingState, cancelAppointmentAsync } from '../store/appointment.slice';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import AppointmentList from '../components/AppointmentList';
import { ConfirmDialog } from '@bookify-v1/shared-components';

const AppointmentContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const appointments = useSelector((state: RootState) => selectAppointments(state));
  const loading = useSelector((state: RootState) => selectLoadingState(state));
  const error = useSelector((state: RootState) => selectAppointmentError(state));

  const providers = useSelector((state: RootState) => state.provider.providers);
  const user = useSelector((state: RootState) => state.auth.user);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const statuses = ['Booked', 'Cancelled'];

  useEffect(() => {
    dispatch(fetchAppointmentsAsync({ status: statuses }));
  }, [dispatch]);

  const getUserFullName = (userId: string) => {
    const provider = providers.find(p => p._id === userId);
    if (provider) return `${provider.firstName} ${provider.lastName}`;
    return user && user.userId === userId ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  const appointmentsWithNames = appointments.map((appointment) => ({
    ...appointment,
    providerName: getUserFullName(appointment.providerId),
    customerName: getUserFullName(appointment.customerId),
    dateTime: appointment.dateTime instanceof Date ? appointment.dateTime.toISOString() : appointment.dateTime,
    endTime: appointment.endTime instanceof Date ? appointment.endTime.toISOString() : appointment.endTime,
    createdAt: appointment.createdAt instanceof Date ? appointment.createdAt.toISOString() : appointment.createdAt
  }));

  const openConfirmDialog = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setConfirmDialogOpen(true);
  };

  const handleCancelAppointment = () => {
    if (selectedAppointmentId) {
      dispatch(cancelAppointmentAsync({ appointmentId: selectedAppointmentId, reason: "User canceled via UI" }));
      setConfirmDialogOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <AppointmentList appointments={appointmentsWithNames} onCancelAppointment={openConfirmDialog} />
      )}

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this appointment?"
        onCancel={handleDialogClose}
        onConfirm={handleCancelAppointment}
      />
    </Box>
  );
};

export default AppointmentContainer;
