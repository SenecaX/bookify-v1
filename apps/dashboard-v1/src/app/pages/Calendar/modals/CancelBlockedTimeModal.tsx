import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { IBlockedTime } from '../../../types';

interface CancelBlockedTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedTime: IBlockedTime;
  onCancelConfirm: (blockedTimeId: string, reason: string) => void;
}

const CancelBlockedTimeModal: React.FC<CancelBlockedTimeModalProps> = ({
  isOpen,
  onClose,
  blockedTime,
  onCancelConfirm,
}) => {
  const [cancellationReason, setCancellationReason] = useState('');

  const handleCancel = () => {
    if (!blockedTime._id) return; 
    onCancelConfirm(blockedTime._id, cancellationReason); // Trigger cancellation with reason
    onClose(); // Close modal after submission
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Cancel Blocked Time
        </Typography>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to cancel this blocked time? Please provide a reason below:
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
          <Button variant="contained" onClick={handleCancel} color="secondary" sx={{ marginRight: 2 }}>
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

export default CancelBlockedTimeModal;
