import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GenericTable from '../containers/GenericTable';
import { AppDispatch, RootState } from '../store';
import { fetchAppointmentsAsync } from '../store/appointment.slice';
import { appointmentColumns } from './appointmentColumns';

const AppointmentContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );
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

  return (
    <Box>
      {loading && <p>Loading appointments...</p>}

      <GenericTable
        data={appointments}
        columns={
          appointmentColumns(
   
          ) as any
        }
      />
    </Box>
  );
};

export default AppointmentContainer;
