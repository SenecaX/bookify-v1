import { Box, Button, Modal, Grid } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectAllServices } from '../../../store/service.slice';
import { selectCustomers, selectProviders } from '../../../store/user.slice';
import { IAppointment } from '../../../types';
import { ControlledAutocomplete } from '@bookify-v1/shared-components';
import ControlledTimeField from '../ControlledTimeField';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface EditAppointmentFormValues {
  customerId: string;
  serviceId: string;
  providerId: string;
  startTime: string;
  endTime: string;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSubmit,
  onCancel,
}) => {
  const methods = useForm<EditAppointmentFormValues>({
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
    if (isOpen && appointment) {
      reset({
        customerId: appointment.customerId,
        serviceId: appointment.serviceId,
        providerId: appointment.providerId,
        startTime: moment(appointment.dateTime).format('HH:mm'),
        endTime: moment(appointment.endTime).format('HH:mm'),
      });
    }
  }, [isOpen, appointment, reset]);

  const handleSubmit = (data: EditAppointmentFormValues) => {
    // Logic to edit the appointment
    onSubmit({ ...data, appointmentId: appointment._id });
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', margin: '100px auto' }}>
        <h3>Appointment Details</h3>
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
                />
              </Grid>
              <Grid container spacing={2} marginBottom={2} marginTop={4}>
                <Grid item xs={6}>
                  <ControlledTimeField label="Start Time" name="startTime" disabled={true}/>
                </Grid>
                <Grid item xs={6}>
                  <ControlledTimeField label="End Time" name="endTime"  disabled={true} />
                </Grid>
              </Grid>
            </Grid>
            <Button onClick={onCancel} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
              Cancel Appointment
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default EditAppointmentModal;
