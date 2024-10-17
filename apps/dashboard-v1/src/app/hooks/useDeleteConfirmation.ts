import { useState } from 'react';

export const useDeleteConfirmation = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog visibility
  const [itemToDelete, setItemToDelete] = useState<any>(null); // State to store the entity to delete

  // Handle delete action - opens confirmation dialog
  const handleDeleteEntity = (entity: any) => {
    setItemToDelete(entity); // Set the item to be deleted
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  // Handle confirm deletion
  const handleConfirmDelete = (deleteCallback: (id: string) => void) => {
    if (itemToDelete) {
      deleteCallback(itemToDelete._id); // Call the passed delete callback function with the ID
      setDeleteDialogOpen(false); // Close the confirmation dialog after deletion
      setItemToDelete(null); // Clear the entity to delete after the action
    }
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false); // Close the confirmation dialog
    setItemToDelete(null); // Clear the entity to delete
  };

  return {
    deleteDialogOpen, // Expose delete dialog state
    itemToDelete, // Expose item to delete
    handleDeleteEntity, // Expose function to set up deletion
    handleConfirmDelete, // Expose function to confirm deletion
    handleCancelDelete, // Expose function to cancel deletion
  };
};
