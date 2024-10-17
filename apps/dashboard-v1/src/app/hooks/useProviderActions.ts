import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createUserAsync, editUserAsync, deleteUserAsync } from '../store/user.slice';
import { User } from '../types';

export const useProviderActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, error, loading } = useSelector((state: RootState) => state.user);  // Access success, error, and loading from state

  // Handle provider registration or edit
  const registerOrEditProvider = (data: any, selectedProvider: User | null) => {
    if (selectedProvider) {
      // If editing, dispatch the edit thunk
      dispatch(editUserAsync({ userId: selectedProvider._id, updates: data }));
    } else {
      // Otherwise, dispatch the register thunk
      dispatch(createUserAsync(data));
    }
  };

  // Handle provider deletion
  const deleteProvider = (providerId: string) => {
    dispatch(deleteUserAsync(providerId));  // Dispatch the delete thunk with the provider ID
  };

  return {
    registerOrEditProvider,  // Expose function to register or edit provider
    deleteProvider,          // Expose function to delete provider
    success,                 // Expose success state
    error,                   // Expose error state
    loading,                 // Expose loading state
  };
};
