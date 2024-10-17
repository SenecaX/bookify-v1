import { CustomSnackbar } from '@bookify-v1/shared-components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { RegistrationFormData } from '../types';
import { AppDispatch, RootState } from '../store';
import { useRegistration } from '../hooks/useRegistration';
import { resetState } from '../store/authSlice';
import { fetchCompanyByNameAsync } from '../store/company.slice';

const companyName = window.location.hostname.split('.')[0]; // Extract subdomain


const AdminRegistrationContainer: React.FC = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.auth?.authStatus || {});
  const { registerAdmin } = useRegistration();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCompanyByNameAsync(companyName));
  }, [dispatch, companyName]);

  // State for Snackbar management
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleRegister = (data: RegistrationFormData) => {
    registerAdmin(data);
  };

  useEffect(() => {
    // Reset the state when the component mounts to avoid any lingering success state
    dispatch(resetState());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Show snackbar for error
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    if (success) {
      // Show success message
      setSnackbarMessage('Admin registered successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Delayed navigation to login page
      setTimeout(() => {
        navigate('/login');
        dispatch(resetState()); // Reset the state after redirect
      }, 500); // Adjust the delay as needed
    }
  }, [error, success, navigate, dispatch]);


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <RegistrationForm onSubmit={handleRegister} loading={loading} error={error} />
      <CustomSnackbar 
        open={snackbarOpen} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
        onClose={handleCloseSnackbar} 
      />
    </>
  );
};

export default AdminRegistrationContainer;
