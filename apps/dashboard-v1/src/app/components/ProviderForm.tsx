import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Paper,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Box,
  MenuItem,
} from '@mui/material';
import {
  ControlledFormInput,
  providerSchema,
} from '@bookify-v1/shared-components';
import { ProviderData, User } from '../types';

interface ProviderFormProps {
  selectedProvider: User | null; // Prop for selected provider
  onSubmit: (data: ProviderData) => void; // Add onSubmit prop
  onDelete: (provider: User) => void; // Update onDelete to accept a provider argument
  loading: boolean;
  error: string | null;
  title: string;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
  selectedProvider,
  onSubmit,
  onDelete,
  loading,
  error,
  title 
}) => {
  // Determine if we're in edit mode
  const isEditMode = Boolean(selectedProvider);

  const methods = useForm<any>({
    resolver: yupResolver(providerSchema),  // Use schema with validation logic
    context: { isEditMode, isUsersPage: title === 'User' },  // Pass context for both modes
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '', // This will only be required when not in edit mode
      phone: '',
      address: {
        street: '',
        city: '',
        zip: '',
        country: '',
      },
    },
  });

  const { reset, handleSubmit } = methods;

  // Populate form fields when selectedProvider changes
  useEffect(() => {
    if (selectedProvider) {
      reset({
        firstName: selectedProvider.firstName,
        lastName: selectedProvider.lastName,
        email: selectedProvider.email,
        phone: selectedProvider.phone,
        address: selectedProvider.address,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: {
          street: '',
          city: '',
          zip: '',
          country: '',
        },
      });
    }
  }, [selectedProvider, reset]);

  const onFormSubmit: SubmitHandler<ProviderData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <Paper
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 600,
          boxSizing: 'border-box',
          margin: 'auto',
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <Typography variant="h5" gutterBottom align="center">
              {/* edit or add put the first and last name instead of title */}
              {isEditMode ? `Edit ${selectedProvider?.firstName} ${selectedProvider?.lastName}` : `Add ${title}`}

            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="firstName"
                  label="First Name"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="email"
                  label="Email"
                  required
                  type="email"
                  fullWidth
                />
              </Grid>

              {title === 'User' && (
            <Grid item xs={12}>
              <ControlledFormInput
                name="role"
                label="Role"
                select // This makes it a dropdown
                required
                fullWidth
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </ControlledFormInput>
            </Grid>
)}

              {/* Password is hidden during edit mode */}
              {!isEditMode && (
                <Grid item xs={12}>
                  <ControlledFormInput
                    name="password"
                    label="Password"
                    required
                    type="password"
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <ControlledFormInput
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="address.street"
                  label="Street Address"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.city"
                  label="City"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.zip"
                  label="ZIP Code"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="address.country"
                  label="Country"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? 'Saving...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
};

export default ProviderForm;
