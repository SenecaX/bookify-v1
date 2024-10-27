import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Button,
  Box,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { deepPurple } from '@mui/material/colors';
import { getStatusColor } from '../utils/utils';

interface AppointmentListProps {
  appointments: Array<{
    _id: string;
    serviceId: string;
    providerId: string;
    customerId: string;
    dateTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    providerName: string;
    customerName: string;
  }>;
  onCancelAppointment: (appointmentId: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onCancelAppointment,
}) => {
  const isCancellable = (dateTime: string) => {
    const appointmentDate = new Date(dateTime);
    const currentTime = new Date();
    const hoursDifference =
      (appointmentDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment._id}>
            <Card
              variant="outlined"
              sx={{
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>
                    <EventIcon />
                  </Avatar>
                }
                title={<></>}
                subheader={`Status: ${appointment.status}`}
                subheaderTypographyProps={{
                  color: getStatusColor(appointment.status),
                }}
              />
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Box>
                  <Typography variant="body2">
                    <strong>Provider:</strong> {appointment.providerName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer:</strong> {appointment.customerName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start:</strong>{' '}
                    {new Date(appointment.dateTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End:</strong>{' '}
                    {new Date(appointment.endTime).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created At:{' '}
                    {new Date(appointment.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                {/* Cancel button, greyed out if appointment is not cancellable */}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onCancelAppointment(appointment._id)}
                  disabled={
                    !isCancellable(appointment.dateTime) ||
                    appointment.status === 'Cancelled'
                  } // Disable if within 24 hours or if already Cancelled
                  sx={{
                    mt: 2,
                    bgcolor:
                      isCancellable(appointment.dateTime) &&
                      appointment.status !== 'Cancelled'
                        ? 'error.main'
                        : 'grey.400', // Grey out if Cancelled or not cancellable
                    '&:hover': {
                      bgcolor:
                        isCancellable(appointment.dateTime) &&
                        appointment.status !== 'Cancelled'
                          ? 'error.dark'
                          : 'grey.400', // Keep grey on hover if disabled
                    },
                  }}
                >
                  Cancel Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography>No appointments found.</Typography>
      )}
    </Grid>
  );
};

export default AppointmentList;
