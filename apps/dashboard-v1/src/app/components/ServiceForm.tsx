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
} from '@mui/material';
import { ControlledFormInput, serviceSchema } from '@bookify-v1/shared-components';
import { ServiceData } from '../types';

interface ServiceFormProps {
  selectedService: ServiceData | null;
  onSubmit: (data: ServiceData) => void;
  onDelete: (service: ServiceData) => void;
  loading: boolean;
  error: string | null;
  title: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  selectedService,
  onSubmit,
  onDelete,
  loading,
  error,
  title,
}) => {
  // Determine if we are in edit mode
  const isEditMode = Boolean(selectedService);

  const methods = useForm<any>({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 0,
      bufferDuration: 0,
    },
  });

  const { reset, handleSubmit } = methods;

  // Populate form fields when selectedService changes
  useEffect(() => {
    if (selectedService) {
      reset({
        name: selectedService.name,
        description: selectedService.description,
        duration: selectedService?.duration || 0,
        bufferDuration: selectedService?.bufferDuration || 0,
      });
    } else {
      reset({
        name: '',
        description: '',
        duration: 60,
        bufferDuration: 10,
      });
    }
  }, [selectedService, reset]);

  const onFormSubmit: SubmitHandler<ServiceData> = (data) => {
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
              {isEditMode ? `Edit ${selectedService?.name}` : `Add ${title}`}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ControlledFormInput
                  name="name"
                  label="Service Name"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="duration"
                  label="Duration (minutes)"
                  fullWidth
                  required
                  type="number"
                />
              </Grid>

              <Grid item xs={12}>
                <ControlledFormInput
                  name="bufferDuration"
                  label="Buffer Duration (minutes)"
                  fullWidth
                  required
                  type="number"
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2" align="center">
                    {error}
                  </Typography>
                </Grid>
              )}

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

export default ServiceForm;
