import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {  fetchServicesAsync } from '../store/service.slice';
import { ServiceData } from '../types';
import { useModal } from './useModal';
import { useServiceActions } from './useServiceActions';
import { useSnackbar } from './useSnackbar';
import { useDeleteConfirmation } from './useDeleteConfirmation';

export const useServiceManager = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Fetch all services
  const services = useSelector((state: RootState) => state.service.services);

  const { registerOrEditService, deleteService, success, error, loading } = useServiceActions();

  // Get the companyId from the companySlice
  const companyId = useSelector((state: RootState) => state.company.company?._id); 

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useSnackbar();

  const {
    deleteDialogOpen,
    itemToDelete,
    handleDeleteEntity,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteConfirmation();

  // Handle service registration
  const handleRegisterService = (data: ServiceData) => {
    if (companyId) {
      // Attach companyId to the service data
      const dataWithCompanyId = {
        ...data,
        companyId, // Add companyId to the service data
      };

      console.log('handleRegisterService called with data:', dataWithCompanyId);
      registerOrEditService(dataWithCompanyId, selectedService);
    } else {
      console.error('Company ID is missing. Unable to register service.');
    }
  };

  const handleEditService = (service: ServiceData) => {
    setSelectedService(service);
    handleOpen();
  };

  // Fetch all services
  useEffect(() => {
    dispatch(fetchServicesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      showSnackbar(
        selectedService
          ? 'Service updated successfully'
          : 'Service registered successfully',
        'success'
      );
      handleClose();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [success, error]);

  return {
    open,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleOpen,
    handleClose,
    handleSnackbarClose,
    handleRegisterService,
    handleDeleteEntity,
    handleConfirmDelete,
    handleCancelDelete,
    handleEditService,
    deleteDialogOpen,
    deleteService,
    loading,
    error,
    services,
    selectedService,
    itemToDelete
  };
};
