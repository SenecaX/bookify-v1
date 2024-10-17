import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Paper, Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import {  RegistrationFormData } from '../types';
import { adminRegistrationSchema } from '@bookify-v1/shared-components';
import { ControlledFormInput } from '@bookify-v1/shared-components';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  loading: boolean;
  error: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const methods = useForm<RegistrationFormData>({
    resolver: yupResolver(adminRegistrationSchema),
  });

  const { handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<RegistrationFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: 'background.default' 
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <Typography variant="h1" component="h1" gutterBottom align="center">
              Admin Registration
            </Typography>

            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="firstName"
                  label="First Name"
                  required
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="lastName"
                  label="Last Name"
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <ControlledFormInput
                  name="email"
                  label="Email"
                  required
                  type="email"
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <ControlledFormInput
                  name="password"
                  label="Password"
                  required
                  type="password"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, borderRadius: '8px' }}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
