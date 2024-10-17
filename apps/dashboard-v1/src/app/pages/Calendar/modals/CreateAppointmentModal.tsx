import React, { useEffect } from 'react';
import { Modal, Box, Grid, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { ControlledAutocomplete, ControlledFormInput } from '@bookify-v1/shared-components';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { selectCustomers, selectProviders } from '../../../store/user.slice';
import { selectAllServices } from '../../../store/service.slice';
import ControlledTimeField from '../ControlledTimeField';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: { start: Date; end: Date } | null;
  onSubmit: (data: any) => void;
}

interface CreateAppointmentFormValues {
  customerId: string;
  serviceId: string;
  providerId: string;
  startTime: string;
  endTime: string;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  onSubmit,
}) => {
  const methods = useForm<CreateAppointmentFormValues>({
    defaultValues: {
      customerId: '',
      serviceId: '',
      providerId: '',
      startTime: '',
      endTime: '',
    },
  });

  const { reset } = methods;

  const customers = useSelector(selectCustomers);
  const providers = useSelector(selectProviders);
  const services = useSelector(selectAllServices);

  useEffect(() => {
    if (isOpen && timeRange) {
      reset({
        customerId: '',
        serviceId: '',
        providerId: '',
        startTime: moment(timeRange.start).format('HH:mm'),
        endTime: moment(timeRange.end).format('HH:mm'),
      });
    }
  }, [isOpen, timeRange, reset]);

  const handleSubmit = (data: CreateAppointmentFormValues) => {
    if (timeRange) {
      const appointmentDate = timeRange.start;
      onSubmit({ ...data, date: appointmentDate });
    } else {
      console.error('No timeRange available');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', margin: '100px auto' }}>
        <h3>Create Appointment</h3>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  name="customerId"
                  label="Customer"
                  options={customers}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  placeholder="Select a customer"
                  rules={{ required: 'Customer is required' }}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </Grid>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  name="serviceId"
                  label="Service"
                  options={services}
                  getOptionLabel={(option) => `${option.name}`}
                  placeholder="Select a service"
                  rules={{ required: 'Service is required' }}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </Grid>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  name="providerId"
                  label="Provider"
                  options={providers}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  placeholder="Select a provider"
                  rules={{ required: 'Provider is required' }}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </Grid>
              <Grid container spacing={2} marginBottom={2} marginTop={4}>
                <Grid item xs={6}>
                  <ControlledTimeField label="Start Time" name="startTime" />
                </Grid>
                <Grid item xs={6}>
                  <ControlledTimeField label="End Time" name="endTime" />
                </Grid>
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">
              Create Appointment
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default CreateAppointmentModal;
