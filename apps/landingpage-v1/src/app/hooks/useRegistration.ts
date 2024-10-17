import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { RegistrationFormData } from '../types';
import { registerAdminAsync } from '../store/authSlice';

export const useRegistration = () => {
  const dispatch = useDispatch<AppDispatch>();

  const registerAdmin = (data: RegistrationFormData) => {
    dispatch(registerAdminAsync(data));  // Dispatch the action with form data
  };

  return { registerAdmin };
};
