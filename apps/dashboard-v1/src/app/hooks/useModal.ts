import { useState } from 'react';

export const useModal = () => {
  const [open, setOpen] = useState(false); // Modal visibility state

  // Open modal
  const handleOpen = () => setOpen(true);

  // Close modal
  const handleClose = () => setOpen(false);

  return {
    open,          // Modal open state
    handleOpen,    // Function to open the modal
    handleClose,   // Function to close the modal
  };
};
