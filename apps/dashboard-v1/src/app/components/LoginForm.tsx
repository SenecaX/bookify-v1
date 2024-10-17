import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Paper, Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import { LoginFormData } from '../types';
import { ControlledFormInput, loginSchema } from '@bookify-v1/shared-components';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const methods = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<LoginFormData> = (data) => {
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
              Login
            </Typography>

            <Grid container spacing={2}>
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
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>

            </Grid>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
};

export default LoginForm;
