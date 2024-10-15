import React from 'react';
import { Modal, Box } from '@mui/material';

interface GenericModalProps {
  open: boolean;          // Boolean to control the open state of the modal
  onClose: () => void;    // Function to handle modal close
  children: React.ReactNode; // Content inside the modal
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
};

export const GenericModal: React.FC<GenericModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="generic-modal-title"
      aria-describedby="generic-modal-description"
    >
      <Box sx={modalStyle}>
        {children}
      </Box>
    </Modal>
  );
};

