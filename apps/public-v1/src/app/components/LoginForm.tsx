import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button, Typography, CircularProgress, Box, Container } from '@mui/material';
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
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: "20px"
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h1" component="h1" align="center" gutterBottom>
            Login
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
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
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
