import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { IAppointment } from '../../../types';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment;
  onCancelConfirm: (appointmentId: string, reason: string) => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onCancelConfirm,
}) => {
  const [cancellationReason, setCancellationReason] = useState('');

  const handleCancel = () => {
    onCancelConfirm(appointment._id, cancellationReason);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
      <Typography variant="h6" gutterBottom>
          Cancel Appointment
        </Typography>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to cancel this appointment? Please provide a reason below:
        </Typography>
        <TextField
          label="Cancellation Reason"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleCancel} color="secondary">
            Confirm Cancel
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CancelAppointmentModal;
