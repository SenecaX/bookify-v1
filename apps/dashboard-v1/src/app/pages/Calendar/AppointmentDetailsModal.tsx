// AppointmentDetailsModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Appointment } from './mockAppointments';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ appointment, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Appointment Details</DialogTitle>
      <DialogContent>
        <p><strong>Customer ID:</strong> {appointment.customerId}</p>
        <p><strong>Service ID:</strong> {appointment.serviceId}</p>
        <p><strong>Provider ID:</strong> {appointment.providerId}</p>
        <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        {appointment.cancellationReason && (
          <p><strong>Cancellation Reason:</strong> {appointment.cancellationReason}</p>
        )}
        {appointment.review && (
          <p><strong>Review:</strong> {appointment.review.rating} Stars - {appointment.review.comment}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
