// AppointmentCalendar.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { Box, Typography, Container, Grid } from '@mui/material';
import moment from 'moment';
import { SlotButton } from './SlotButton';
import { useQueryParams } from './useQuery';
import { CalendarSection } from './CalendarSection';
import Section from './Section'; // New Section component
import { RootState } from '../../store';
import { useCalendarActions } from './useCalendarActions'; // Import the custom hook
import { selectAvailableSlots, selectAppointmentError } from '../../store/appointment.slice'; // Import selectors
import { useNavigate } from 'react-router-dom';

const AppointmentCalendar: React.FC = () => {
  const { providerId, serviceId } = useQueryParams();
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { fetchAvailableSlots } = useCalendarActions(); // Get the fetch action from useCalendarActions
  const navigate = useNavigate();
  
  // Use Redux to fetch the available slots from the store
  const availableSlots: string[] = useSelector(selectAvailableSlots);
  const appointmentError: string | null = useSelector(selectAppointmentError);

  const providers = useSelector((state: RootState) => state.provider.providers);
  const services = useSelector((state: RootState) => state.service.services);

  // Use the providerId and serviceId to find names
  const providerName = providers
  .find(p => p._id === providerId) 
  ? `${providers.find(p => p._id === providerId)?.firstName} ${providers.find(p => p._id === providerId)?.lastName}`
  : 'Unknown Provider';

  const serviceName = services.find(s => s._id === serviceId)?.name;

  // Fetch available slots when component loads and when selectedDate, providerId, or serviceId changes
  useEffect(() => {
    if (selectedDate && providerId && serviceId) {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      fetchAvailableSlots(providerId, serviceId, formattedDate)
        .then((response) => {
          if (!response.success) {
            setErrorMessage(response.error.message || 'Error fetching slots');
          } else {
            setErrorMessage(null); // Clear error if fetch is successful
          }
        });
    }
  }, [selectedDate, providerId, serviceId, fetchAvailableSlots]);

  // Load the selected date or set it to the current date on initial render
  useEffect(() => {
    if (!selectedDate) {
      const currentDate = moment(); // Get the current date
      setSelectedDate(currentDate);

      // Update the URL with the selected date without overwriting existing params
      const params = new URLSearchParams(window.location.search);
      params.set('date', currentDate.format('YYYY-MM-DD')); // Set the date parameter
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`); // Update URL
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    const selectedMoment = moment(date);
    setSelectedDate(selectedMoment);

    // Update the URL with the new selected date without overwriting existing params
    const params = new URLSearchParams(window.location.search);
    params.set('date', selectedMoment.format('YYYY-MM-DD')); // Update the date parameter
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`); // Update URL
  };

  const handleTimeSlotSelect = (slot: string) => {
    console.log(`Selected slot: ${slot}`);
  
    // Construct the URL for /confirm-booking with all parameters
    const params = new URLSearchParams({
      providerId: providerId || '',
      serviceId: serviceId || '',
      date: selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
      time: slot, // Add the selected time slot to the URL
    });
  
    // Use navigate to go to /confirm-booking with the parameters
    navigate(`/confirm-booking?${params.toString()}`);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointment Calendar
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Reuse Section component for displaying Provider ID and Service ID */}
        <Grid item xs={12} sm={6}>
          <Section title="Provider Information" content={providerName || 'N/A'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Section title="Service Information" content={serviceName || 'N/A'} />
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={4}>
        {/* Calendar Section */}
        <Grid item xs={12} sm={6}>
          <CalendarSection onDateSelect={handleDateSelect} />
        </Grid>

        {/* Available Time Slots Section */}
        <Grid item xs={12} sm={6}>
          <Box boxShadow={3} p={2} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Available Slots for {selectedDate ? selectedDate.format('MMMM Do YYYY') : 'Selected Date'}:
            </Typography>
            {availableSlots.length > 0 ? (
           <Box>
           <Grid container spacing={2}> {/* spacing={2} adds some gap between the buttons */}
             {availableSlots.map((slot: string, index: number) => (
               <Grid item xs={12} sm={4} key={slot}> {/* xs=12 on mobile (full width), sm=4 means 3 per row on small and larger screens */}
                 <SlotButton
                   key={slot} // Unique key for each button
                   slot={slot} // Pass the time string
                   onSelect={handleTimeSlotSelect} // Handle slot selection
                 />
               </Grid>
             ))}
           </Grid>
         </Box>
            ) : (
              <Typography variant="body1">
                {errorMessage || appointmentError || 'No slots available for the selected date.'}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentCalendar;
