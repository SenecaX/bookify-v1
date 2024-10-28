import { CustomSnackbar } from '@bookify-v1/shared-components';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';  // This component is for the form
import { CompanyRegistrationFormData } from '../types';  // Placeholder for types
import { RootState } from '../store';
import { useCompanyRegistration } from '../hooks/useCompanyRegistration';

const CompanyRegistrationContainer: React.FC = () => {
  const { authStatus: { loading, error }, user } = useSelector((state: RootState) => state.auth);
  const { companyStatus: { success } } = useSelector((state: RootState) => state.company);
  const { registerCompany } = useCompanyRegistration();  // Placeholder for the registration action
  const navigate = useNavigate();

  // State for Snackbar management
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Handler for company registration submission
  const handleRegister = (data: CompanyRegistrationFormData) => {
    registerCompany(data);  // Placeholder for the action to register the company
  };

  useEffect(() => {
    if (success) {
      setSnackbarMessage('Company registered successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Navigate to the next step (e.g., working hours configuration)
      navigate('/company-hours');  // Placeholder for the next step after company registration
    } else if (error) {
      setSnackbarMessage(error || 'Company registration failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [success, error, navigate, user]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <CompanyRegistrationForm onSubmit={handleRegister} loading={loading} error={error} />
      <CustomSnackbar 
        open={snackbarOpen} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
        onClose={handleCloseSnackbar} 
      />
    </>
  );
};

export default CompanyRegistrationContainer;
