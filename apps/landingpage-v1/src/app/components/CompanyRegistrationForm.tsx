import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Paper, Grid, Button, Typography, CircularProgress, Box, MenuItem, TextField } from '@mui/material';
import { companyRegistrationSchema } from '@bookify-v1/shared-components';
import { ControlledFormInput } from '@bookify-v1/shared-components';
import { CompanyRegistrationFormData } from '../types';
import { companyHourUtils } from '../pages/CompanyHoursSetup/companyHourUtils';

// Define the data structure for company registration
interface CompanyRegistrationFormProps {
  onSubmit: (data: CompanyRegistrationFormData) => void;
  loading: boolean;
  error: string | null;
}

const categories = [
  { label: 'Technology', value: 'technology' },
  { label: 'Retail', value: 'retail' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Service', value: 'service' },
];

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const methods = useForm<any>({
    resolver: yupResolver(companyRegistrationSchema),  // Make sure to create a schema for validation
    defaultValues: {
      name: '',
      address: {
        street: '',
        city: '',
        zip: '',
        country: '',
      },
      category: '',
      workingHours: companyHourUtils, // Set default workingHours
    },
  });

  const { handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<CompanyRegistrationFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <Typography variant="h1" component="h1" gutterBottom align="center">
              Company Registration
            </Typography>

            <Grid container spacing={2}>
              {/* Company Name */}
              <Grid item xs={12}>
                <ControlledFormInput
                  name="name"
                  label="Company Name"
                  required
                />
              </Grid>

              {/* Address Fields */}
              <Grid item xs={12}>
                <ControlledFormInput
                  name="address.street"
                  label="Street"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.city"
                  label="City"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.zip"
                  label="Zip Code"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.country"
                  label="Country"
                  required
                />
              </Grid>

              {/* Category Dropdown */}
              <Grid item xs={12}>
                <ControlledFormInput
                  name="category"
                  label="Category"
                  select  // Makes this a dropdown field
                  required
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </ControlledFormInput>
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

            {/* Error Message */}
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
};

export default CompanyRegistrationForm;
