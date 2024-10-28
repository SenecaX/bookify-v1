import { CustomSnackbar } from '@bookify-v1/shared-components';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { RegistrationFormData } from '../types';
import { useRegistration } from '../hooks/useRegistration';
import { RootState } from '../store';

const AdminRegistrationContainer: React.FC = () => {
  const { authStatus: { loading, error, success }, user } = useSelector((state: RootState) => state.auth);
  const { registerAdmin } = useRegistration();
  const navigate = useNavigate();

  // State for Snackbar management
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleRegister = (data: RegistrationFormData) => {
    registerAdmin(data);
  };

  useEffect(() => {
    if (success) {
      setSnackbarMessage('Admin registered successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Navigate to the company registration page
      navigate('/company-registration');
    } else if (error) {
      setSnackbarMessage(error || 'Registration failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [success, error, navigate, user]);

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
