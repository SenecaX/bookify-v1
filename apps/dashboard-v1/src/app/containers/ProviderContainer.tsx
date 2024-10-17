import {
  ConfirmDialog,
  CustomSnackbar,
  GenericModal,
} from '@bookify-v1/shared-components';
import { Box, Button } from '@mui/material';
import React from 'react';
import ProviderForm from '../components/ProviderForm';
import GenericTable from './GenericTable';
import { providerColumns } from './providerColumns';

// ProviderContainer.tsx
interface ProviderContainerProps {
  data: any[]; // Accept data (providers) as a prop
  open: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: string;
  handleOpen: () => void;
  handleClose: () => void;
  handleSnackbarClose: () => void;
  handleRegisterProvider: (data: any) => void;
  handleEditProvider: (provider: any) => void;
  handleDeleteEntity: (provider: any) => void;
  deleteDialogOpen: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: (deleteCallback: (id: string) => void) => void; // Correct signature
  loading: boolean;
  error: string | null;
  selectedProvider: any;
  deleteProvider: (id: string) => void;
  addButtonText: string;
  title: string;
  itemToDelete: any;
}

const ProviderContainer: React.FC<ProviderContainerProps> = ({
  data, // Providers passed as data prop
  open,
  snackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  handleOpen,
  handleClose,
  handleSnackbarClose,
  handleRegisterProvider,
  handleEditProvider,
  handleDeleteEntity,
  deleteDialogOpen,
  handleCancelDelete,
  handleConfirmDelete,
  loading,
  error,
  selectedProvider,
  deleteProvider,
  addButtonText,
  title,
  itemToDelete
}) => {
  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ marginBottom: '1rem' }}
      >
        {addButtonText}
      </Button>

      {/* Modal with the provider form */}
      <GenericModal open={open} onClose={handleClose}>
        <ProviderForm
          selectedProvider={selectedProvider}
          onDelete={() => handleDeleteEntity(selectedProvider)}
          onSubmit={handleRegisterProvider}
          loading={loading}
          error={error}
          title={title}
        />
      </GenericModal>

      {/* Use the GenericTable and pass the data and columns */}
      {data && data.length > 0 ? (
        <GenericTable
          data={data}
          columns={providerColumns(handleEditProvider, handleDeleteEntity) as any}
        />
      ) : (
        <p>No providers available</p>
      )}

      {/* Snackbar for success/error feedback */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity as 'error' | 'success' | 'info' | 'warning'}
        onClose={handleSnackbarClose}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
  open={deleteDialogOpen}
  title={`Delete ${title}`}
  message={`Are you sure you want to delete ${itemToDelete?.firstName} ${itemToDelete?.lastName}?`}
  onCancel={handleCancelDelete}
  onConfirm={() => handleConfirmDelete(deleteProvider)} // Pass deleteProvider correctly here
/>
    </Box>
  );
};

export default ProviderContainer;
