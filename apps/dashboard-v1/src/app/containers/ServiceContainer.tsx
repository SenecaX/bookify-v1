
import { Box, Button } from '@mui/material';
import React from 'react';
import ServiceForm from '../components/ServiceForm';
import { ConfirmDialog, CustomSnackbar, GenericModal } from '@bookify-v1/shared-components';
import { serviceColumns } from './serviceColumns';
import GenericTable from './GenericTable';

interface ServiceContainerProps {
  data: any[]; // Accept data (services) as a prop
  open: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: string;
  handleOpen: () => void;
  handleClose: () => void;
  handleSnackbarClose: () => void;
  handleRegisterService: (data: any) => void;
  handleEditService: (service: any) => void;
  handleDeleteEntity: (service: any) => void;
  deleteDialogOpen: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: (deleteCallback: (id: string) => void) => void; // Correct signature
  loading: boolean;
  error: string | null;
  selectedService: any;
  deleteService: (id: string) => void;
  addButtonText: string;
  title: string;
  itemToDelete: any;
}

const ServiceContainer: React.FC<ServiceContainerProps> = ({
  data, // Services passed as data prop
  open,
  snackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  handleOpen,
  handleClose,
  handleSnackbarClose,
  handleRegisterService,
  handleEditService,
  handleDeleteEntity,
  deleteDialogOpen,
  handleCancelDelete,
  handleConfirmDelete,
  loading,
  error,
  selectedService,
  deleteService,
  addButtonText,
  title,
  itemToDelete,
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

      {/* Modal with the service form */}
      <GenericModal open={open} onClose={handleClose}>
        <ServiceForm
          selectedService={selectedService}
          onDelete={() => handleDeleteEntity(selectedService)}
          onSubmit={handleRegisterService}
          loading={loading}
          error={error}
          title={title}
        />
      </GenericModal>

      {/* Use the GenericTable and pass the data and columns */}
      {data && data.length > 0 ? (
        <GenericTable
          data={data}
          columns={serviceColumns(handleEditService, handleDeleteEntity) as any}
        />
      ) : (
        <p>No services available</p>
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
        message={`Are you sure you want to delete ${itemToDelete?.name}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleConfirmDelete(deleteService)} // Pass deleteService correctly here
      />
    </Box>
  );
};

export default ServiceContainer;
