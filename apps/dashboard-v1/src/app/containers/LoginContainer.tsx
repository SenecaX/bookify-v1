import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { LoginFormData } from '../types';
import { AppDispatch, RootState } from '../store';
import { useLogin } from '../hooks/useLogin';
import { CustomSnackbar } from '@bookify-v1/shared-components';
import { resetState } from '../store/authSlice';
import { fetchCompanyByNameAsync } from '../store/company.slice';

const companyName = window.location.hostname.split('.')[0]; // Extract subdomain

const LoginContainer: React.FC = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.auth?.authStatus || {});
  const { loginUser } = useLogin();
  const navigate = useNavigate();

  // State for Snackbar management
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Dispatch to fetch company data once login is successful
    dispatch(fetchCompanyByNameAsync(companyName));
  }, [dispatch, companyName]);

  const handleLogin = (data: LoginFormData) => {
    loginUser(data);
  };


  useEffect(() => {
    // Reset success and error state when the login page mounts
    dispatch(resetState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setSnackbarMessage('Admin logged in successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/calendar'); 
    } else if (error) {
      setSnackbarMessage(error || 'Login failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [success, error, navigate]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      <CustomSnackbar 
        open={snackbarOpen} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
        onClose={handleCloseSnackbar} 
      />
    </>
  );
};

export default LoginContainer;
