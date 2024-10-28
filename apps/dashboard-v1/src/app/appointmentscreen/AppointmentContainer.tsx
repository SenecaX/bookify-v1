import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GenericTable from '../containers/GenericTable';
import { AppDispatch, RootState } from '../store';
import { fetchAppointmentsAsync } from '../store/appointment.slice';
import { appointmentColumns } from './appointmentColumns';

const AppointmentContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access appointments, users, and services from the state
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);
  const { users } = useSelector((state: RootState) => state.user);
  const { services } = useSelector((state: RootState) => state.service);
  const status = ['Booked', 'Cancelled'];

  useEffect(() => {
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    dispatch(
      fetchAppointmentsAsync({
        start: twoMonthsAgo.toISOString(),
        end: today.toISOString(),
        status,
      })
    );
  }, [dispatch]);

  // Helper functions to find names by ID
  const getUserNameById = (userId: string) => {
    const user = users.find((user) => user._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getServiceNameById = (serviceId: string) => {
    const service = services.find((service) => service._id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  return (
    <Box>
      {loading && <p>Loading appointments...</p>}

      <GenericTable
        data={appointments}
        columns={
          appointmentColumns(
            getUserNameById,
            getServiceNameById
          ) as any
        }
      />
    </Box>
  );
};

export default AppointmentContainer;
