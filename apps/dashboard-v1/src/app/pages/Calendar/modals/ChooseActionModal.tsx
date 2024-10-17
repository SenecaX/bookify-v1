import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

interface ChooseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseAppointment: () => void;
  onChooseBlockedTime: () => void;
}

const ChooseActionModal: React.FC<ChooseActionModalProps> = ({
  isOpen,
  onClose,
  onChooseAppointment,
  onChooseBlockedTime,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box 
        sx={{
          backgroundColor: 'white',
          padding: '20px',
          maxWidth: '400px',
          margin: '100px auto',
          borderRadius: '8px',
          boxShadow: 24,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          What would you like to do?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onChooseAppointment}
          sx={{ marginBottom: 2 }}
        >
          Create Appointment
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onChooseBlockedTime}
        >
          Block Time
        </Button>
      </Box>
    </Modal>
  );
};

export default ChooseActionModal;
