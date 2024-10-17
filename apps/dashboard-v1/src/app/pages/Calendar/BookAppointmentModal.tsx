import React, { useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import ControlledTimeField from './ControlledTimeField';
import moment from 'moment';
import { IAppointment, ServiceData, User } from '../../types';
import {
  ControlledFormInput,
  ControlledAutocomplete,
} from '@bookify-v1/shared-components';
import { useSelector } from 'react-redux';
import { selectCustomers, selectProviders } from '../../store/user.slice';
import { selectAllServices } from '../../store/service.slice';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAppointment: IAppointment | null;
  timeRange: { start: Date; end: Date } | null;
  onSubmit: (data: any) => void;
  onCancelAppointment: (appointment: IAppointment) => void;
}

interface BookAppointmentFormValues {
  customerId: string;
  serviceId: string;
  providerId: string;
  startTime: string;
  endTime: string;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedAppointment,
  timeRange,
  onSubmit,
  onCancelAppointment,
}) => {
  const methods = useForm<BookAppointmentFormValues>({
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
    if (isOpen) {
      if (selectedAppointment) {
        reset({
          customerId: selectedAppointment.customerId,
          serviceId: selectedAppointment.serviceId,
          providerId: selectedAppointment.providerId,
          startTime: moment(selectedAppointment.dateTime).format('HH:mm'),
          endTime: moment(selectedAppointment.endTime).format('HH:mm'),
        });
      } else if (timeRange) {
        reset({
          customerId: '',
          serviceId: '',
          providerId: '',
          startTime: moment(timeRange.start).format('HH:mm'),
          endTime: moment(timeRange.end).format('HH:mm'),
        });
      }
    }
  }, [isOpen, selectedAppointment, timeRange, reset]);

  const handleSubmit = (data: BookAppointmentFormValues) => {
    if (timeRange) {
      const appointmentDate = timeRange.start;
      onSubmit({ ...data, date: appointmentDate });
    } else {
      console.error('No timeRange available');
    }
  };
  
  if (!isOpen) return null;

  return (
    <div>
      <h3>Book Appointment</h3>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={12}>
              <ControlledAutocomplete
                name="customerId"
                label="Customer"
                options={customers}
                getOptionLabel={(option: User) =>
                  `${option.firstName} ${option.lastName}`
                }
                placeholder="Select a customer"
                rules={{ required: 'Customer is required' }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                } 
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledAutocomplete
                name="serviceId"
                label="Service"
                options={services}
                getOptionLabel={(option: ServiceData) =>
                  `${option.name}`
                }
                placeholder="Select a service"
                rules={{ required: 'Service is required' }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledAutocomplete
                name="providerId"
                label="Provider"
                options={providers}
                getOptionLabel={(option: User) =>
                  `${option.firstName} ${option.lastName}`
                }
                placeholder="Select a provider"
                rules={{ required: 'Provider is required' }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
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
            Book Appointment
          </Button>

          {/* Render Cancel Appointment button if editing an existing appointment */}
          {selectedAppointment && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onCancelAppointment(selectedAppointment)}
              style={{ marginLeft: '10px' }} // Optional styling
            >
              Cancel Appointment
            </Button>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default BookAppointmentModal;
