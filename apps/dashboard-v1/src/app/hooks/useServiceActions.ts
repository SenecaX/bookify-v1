import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createServiceAsync, editServiceAsync, deleteServiceAsync } from '../store/service.slice';
import { ServiceData } from '../types';

export const useServiceActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, error, loading } = useSelector((state: RootState) => state.service); // Access success, error, and loading from state

  // Handle service creation or editing
  const registerOrEditService = (data: ServiceData, selectedService: ServiceData | null) => {
    if (selectedService) {
      // If editing, dispatch the edit thunk
      dispatch(editServiceAsync({ serviceId: selectedService._id!, updates: data }));
    } else {
      // Otherwise, dispatch the create thunk
      dispatch(createServiceAsync(data));
    }
  };

  // Handle service deletion
  const deleteService = (serviceId: string) => {
    dispatch(deleteServiceAsync(serviceId)); // Dispatch the delete thunk with the service ID
  };

  return {
    registerOrEditService, // Expose function to register or edit service
    deleteService,          // Expose function to delete service
    success,                // Expose success state
    error,                  // Expose error state
    loading,                // Expose loading state
  };
};
