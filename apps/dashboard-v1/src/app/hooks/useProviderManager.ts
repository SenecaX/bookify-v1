// useProviderManager.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { clearStatus, fetchUsersAsync, selectProviders } from '../store/user.slice';
import { User } from '../types';
import { useModal } from './useModal';
import { useProviderActions } from './useProviderActions';
import { useSnackbar } from './useSnackbar';
import { useDeleteConfirmation } from './useDeleteConfirmation';

export const useProviderManager = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Fetch all users and providers
  const users = useSelector((state: RootState) => state.user.users);
  const providers = useSelector(selectProviders);

  const { registerOrEditProvider, deleteProvider, success, error, loading } =
    useProviderActions();

        // Get the companyId from the companySlice
        const companyId = useSelector((state: RootState) => state.company.company?._id); // Assuming company.adminId holds the ID
  

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

  const handleRegisterProvider = (data: User) => {
    if (companyId) {
      // Attach companyId and check if the role exists
      const dataWithCompanyId = {
        ...data,
        companyId, // Add companyId to the provider data
        role: data.role || 'provider', // Ensure role defaults to 'provider'
      };
  
      console.log('handleRegisterProvider called with data:', dataWithCompanyId);
      registerOrEditProvider(dataWithCompanyId, selectedProvider);
    } else {
      console.error('Company ID is missing. Unable to register provider.');
    }
  };
  
  const handleEditProvider = (provider: User) => {
    setSelectedProvider(provider);
    handleOpen();
  };

  // Fetch all users
  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      showSnackbar(
        selectedProvider
          ? 'Provider updated successfully'
          : 'Provider registered successfully',
        'success',
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
    handleRegisterProvider,
    handleDeleteEntity,
    handleConfirmDelete,
    handleCancelDelete,
    handleEditProvider,
    deleteDialogOpen,
    deleteProvider,
    loading,
    error,
    users,    // Returning all users now
    providers, // Returning filtered providers
    selectedProvider,
    itemToDelete
  };
};
