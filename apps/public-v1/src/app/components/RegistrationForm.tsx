import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button, Typography, CircularProgress, Box, Container } from '@mui/material';
import { RegistrationFormData } from '../types';
import { adminRegistrationSchema, ControlledFormInput } from '@bookify-v1/shared-components';

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
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Admin Registration
          </Typography>

          {error && (
            <Typography variant="body2" color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
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
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
