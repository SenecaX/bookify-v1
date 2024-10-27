import React from 'react';
import { Grid, Card, CardContent, CardHeader, Typography, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { deepPurple } from '@mui/material/colors';

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
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment._id}>
            <Card variant="outlined" sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>
                    <EventIcon />
                  </Avatar>
                }
                title={
                 <></>
                }
                subheader={`Status: ${appointment.status}`}
                subheaderTypographyProps={{ color: getStatusColor(appointment.status) }}
              />
              <CardContent>
                <Typography variant="body2"><strong>Provider:</strong> {appointment.providerName}</Typography>
                <Typography variant="body2"><strong>Customer:</strong> {appointment.customerName}</Typography>
                <Typography variant="body2"><strong>Start:</strong> {new Date(appointment.dateTime).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>End:</strong> {new Date(appointment.endTime).toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">Created At: {new Date(appointment.createdAt).toLocaleString()}</Typography>
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

// Utility function to determine status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'booked':
      return 'primary';
    case 'completed':
      return 'success.main';
    case 'cancelled':
      return 'error.main';
    case 'blocked':
      return 'warning.main';
    default:
      return 'text.primary';
  }
};

export default AppointmentList;
