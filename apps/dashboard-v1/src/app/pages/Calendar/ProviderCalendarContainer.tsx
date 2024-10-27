import { CustomSnackbar } from '@bookify-v1/shared-components';
import { Autocomplete, Box, TextField } from '@mui/material';
import moment from 'moment-timezone';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Event as BigCalendarEvent,
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import {
  selectAppointments,
  selectBlockedTimes,
} from '../../store/appointment.slice';
import { fetchServicesAsync } from '../../store/service.slice';
import { fetchUsersAsync, selectProviders } from '../../store/user.slice';
import { IAppointment, User } from '../../types';
import { createEvents } from './calendarUtils';
import CancelAppointmentModal from './modals/CancelAppointmentModal';
import CancelBlockedTimeModal from './modals/CancelBlockedTimeModal';
import ChooseActionModal from './modals/ChooseActionModal';
import CreateAppointmentModal from './modals/CreateAppointmentModal';
import CreateBlockedTimeModal from './modals/CreateBlockedTimeModal';
import EditAppointmentModal from './modals/EditAppointmentModal';
import EditBlockedTimeModal from './modals/EditBlockedTimeModal';
import { useCalendarActions } from './useCalendarActions';
import useProviderCalendarManager from './useProviderCalendarManager';
import { fetchCompanyByNameAsync } from '../../store/company.slice';

const companyName = window.location.hostname.split('.')[0]; // Extract subdomain


// Localizer for calendar
const localizer = momentLocalizer(moment);

const ProviderCalendarContainer: React.FC = () => {
  // Centralized modal state
  const [modalState, setModalState] = useState<{
    type: string | null;
    data: any;
  }>({ type: null, data: null });

  const openModal = (type: string, data: any = null) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  const [isChooseActionModalOpen, setIsChooseActionModalOpen] = useState(false);
  const [selectedSlotRange, setSelectedSlotRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const appointments = useSelector(selectAppointments);
  const blockedTimes = useSelector(selectBlockedTimes);
  const {
    fetchAppointments,
    fetchBlockedTimes,
    blockTime,
    bookAppointment,
    cancelAppointment,
    cancelBlockedTime,
  } = useCalendarActions();

  const navigate = useNavigate(); // To update URL
  const location = useLocation(); // To read URL

  const dispatch = useDispatch<AppDispatch>();

  const providers = useSelector(selectProviders);
  const auth = useSelector((state: RootState) => state.auth.user);

  // Extract providerId from URL query params on page load
  const queryParams = new URLSearchParams(location.search);
  const initialProviderId = queryParams.get('providerId');

  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);

  useEffect(() => {
    // Dispatch to fetch company data once login is successful
    dispatch(fetchCompanyByNameAsync(companyName));
  }, [dispatch, companyName]);

  useEffect(() => {
    // If we have a providerId in the URL, find the matching provider and set it
    if (initialProviderId && !selectedProvider) {
      const provider = providers.find((p) => p._id === initialProviderId);
      if (provider) {
        setSelectedProvider(provider);
      }
    }
  }, [initialProviderId, providers, selectedProvider]);

  useEffect(() => {
    if (auth.role === 'provider' || providers.length === 0) {
      dispatch(fetchUsersAsync());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchServicesAsync());
  }, [dispatch]);

  const handleProviderChange = (event: any, newProvider: User | null) => {
    setSelectedProvider(newProvider);

    if (newProvider) {
      // Update the URL with the selected providerId
      navigate({
        pathname: location.pathname,
        search: `?providerId=${newProvider._id}`, // Append providerId to query params
      });

      // Fetch appointments and blocked times for the selected provider
      fetchAppointments(
        startOfRange.toISOString(),
        endOfRange.toISOString()
      );
      fetchBlockedTimes(
        newProvider._id,
        startOfRange.toISOString(),
        endOfRange.toISOString()
      );
    }
  };

  const {
    getWorkingHoursLimits,
    isOffDayOrHoliday,
    getBreakEvents,
    isBreakTime,
    hasConflict,
    getSlotStyle,
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    startOfRange,
    endOfRange,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    triggerErrorSnackbar,
    triggerSuccessSnackbar,
  } = useProviderCalendarManager();

  // Fetch appointments and blocked times when date range changes
  useEffect(() => {
    if (startOfRange && endOfRange) {
      // Admin: Ensure a provider is selected
      if (auth.role === 'admin' && selectedProvider) {
        const providerId = selectedProvider._id;

        fetchAppointments(
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
        fetchBlockedTimes(
          providerId,
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
      }
      // Provider: Use auth.userId
      else if (auth.role === 'provider') {
        const providerId = auth.userId;
        if (!providerId) return;

        fetchAppointments(
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
        fetchBlockedTimes(
          providerId,
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
      }
    }
  }, [
    fetchAppointments,
    fetchBlockedTimes,
    startOfRange,
    endOfRange,
    auth.role,
    auth.userId,
    selectedProvider,
  ]);

  const providerId =
    auth.role === 'provider' ? auth.userId : selectedProvider?._id;

  // Filter provider's appointments for the current provider
  const providerAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.providerId === providerId
      ),
    [appointments, providerId]
  );

  // Create events for both appointments and blocked times
  const events = useMemo(() => {
    return createEvents(providerAppointments, blockedTimes);
  }, [providerAppointments, blockedTimes]);

  const handleSelectEvent = (event: BigCalendarEvent) => {
    if (event.resource) {
      const isAppointment =
        (event.resource as IAppointment).customerId !== undefined;
      if (isAppointment) {
        // It's an appointment
        openModal('editAppointment', event.resource);
      } else {
        // It's a blocked time
        openModal('editBlockedTime', event.resource);
      }
    }
  };

  // Handle slot selection to block time or create appointment
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const breakEvents = getBreakEvents(
      startOfRange.toDate(),
      endOfRange.toDate()
    );

    const hasConflicts = hasConflict(
      start,
      end,
      breakEvents,
      providerAppointments.map((appt) => ({
        start: moment(appt.dateTime).toDate(),
        end: appt.endTime
          ? moment(appt.endTime).toDate()
          : moment(appt.dateTime).add(1, 'hour').toDate(),
      })),
      blockedTimes
    );

    if (hasConflicts) {
      triggerErrorSnackbar(
        'The selected time slot contains a break, appointment, or blocked time.'
      );
      return;
    }

    // Store the selected time range
    setSelectedSlotRange({ start, end });

    // Open the new ChooseActionModal
    setIsChooseActionModalOpen(true);
  };

  const handleChooseAppointment = () => {
    setIsChooseActionModalOpen(false);
    if (selectedSlotRange) {
      openModal('createAppointment', selectedSlotRange);
    }
  };

  const handleChooseBlockedTime = () => {
    setIsChooseActionModalOpen(false);
    if (selectedSlotRange) {
      openModal('createBlockedTime', selectedSlotRange);
    }
  };

  // Handler for Booking Appointments
  const handleBookAppointmentSubmit = async (data: any) => {
    if (!providerId) return;

    console.log("data", data)

    try {
      const formattedDate = moment(data.date).format('YYYY-MM-DD');
      console.log("formattedDate", formattedDate)
      const response = await bookAppointment(
        data.customerId,
        data.providerId,
        data.serviceId,
        formattedDate,
        data.startTime
      );

      if (response.success) {
        closeModal(); // Close modal on success
        fetchAppointments(
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
        triggerSuccessSnackbar('Appointment booked successfully');
      } else {
        triggerErrorSnackbar('Error booking appointment: ' + response.error);
        console.error('Error booking appointment:', response.error);
      }
    } catch (error) {
      triggerErrorSnackbar(
        'An unexpected error occurred while booking the appointment'
      );
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleBlockTimeSubmit = async (data: {
    startTime: string;
    endTime: string;
    reason: string;
  }) => {
    if (!providerId) return;

    try {
      const response = await blockTime(
        providerId,
        data.startTime,
        data.endTime,
        data.reason
      );
      if (response.success) {
        closeModal(); // Close modal on success
        fetchBlockedTimes(
          providerId,
          startOfRange.toISOString(),
          endOfRange.toISOString()
        ); // Refresh blocked times
        triggerSuccessSnackbar('Time blocked successfully');
      } else {
        triggerErrorSnackbar('Error blocking time: ' + response.error);
        console.error('Error blocking time:', response.error);
      }
    } catch (error) {
      triggerErrorSnackbar('An unexpected error occurred while blocking time');
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleCancelAppointmentConfirm = async (
    appointmentId: string,
    reason: string
  ) => {
    try {
      const response = await cancelAppointment(appointmentId, reason);
      if (response.success && providerId) {
        closeModal();
        fetchAppointments(
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
        triggerSuccessSnackbar('Appointment cancelled successfully');
      } else {
        triggerErrorSnackbar('Error cancelling appointment: ' + response.error);
        console.error('Error cancelling appointment:', response.error);
      }
    } catch (error) {
      triggerErrorSnackbar('An unexpected error occurred while cancelling the appointment');
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleCancelBlockedTimeConfirm = async (
    blockedTimeId: string,
    reason: string
  ) => {

    try {
      const response = await cancelBlockedTime(blockedTimeId, reason);
      if (response.success && providerId) {
        closeModal();
        fetchBlockedTimes(
          providerId,
          startOfRange.toISOString(),
          endOfRange.toISOString()
        );
        triggerSuccessSnackbar('Blocked time cancelled successfully');
      } else {
        triggerErrorSnackbar('Error cancelling blocked time: ' + response.error);
        console.error('Error cancelling blocked time:', response.error);
      }
    } catch (error) {
      triggerErrorSnackbar('An unexpected error occurred while cancelling the blocked time');
      console.error('Failed to cancel blocked time:', error);
    }
  };

  const renderProviderSelection = () => {
    if (auth.role === 'admin') {
      return (
        <Autocomplete
          options={providers}
          getOptionLabel={(provider) =>
            `${provider.firstName} ${provider.lastName}`
          }
          value={selectedProvider}
          onChange={handleProviderChange}
          renderInput={(params) => (
            <TextField {...params} label="Select Provider" />
          )}
        />
      );
    }
    return null;
  };

  return (
    <div>
      <h2>Provider's Calendar</h2>
      <Box sx={{ marginBottom: 5 }}>{renderProviderSelection()}</Box>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
        view={currentView}
        date={currentDate.toDate()}
        slotPropGetter={(date) => getSlotStyle(date, isBreakTime)}
        onView={setCurrentView}
        onNavigate={(newDate) => setCurrentDate(moment(newDate))}
        onSelectEvent={handleSelectEvent}
        selectable
        onSelectSlot={handleSelectSlot}
        dayPropGetter={(date) => ({
          style: {
            backgroundColor: isOffDayOrHoliday(date) ? '#f0f0f0' : 'white',
            pointerEvents: isOffDayOrHoliday(date) ? 'none' : 'auto',
          },
        })}
        min={getWorkingHoursLimits(currentDate.toDate()).min}
        max={getWorkingHoursLimits(currentDate.toDate()).max}
      />

      <ChooseActionModal
        isOpen={isChooseActionModalOpen}
        onClose={() => setIsChooseActionModalOpen(false)}
        onChooseAppointment={handleChooseAppointment}
        onChooseBlockedTime={handleChooseBlockedTime}
      />

      {/* Render modals conditionally based on modalState.type */}
      {modalState.type === 'createAppointment' && (
        <CreateAppointmentModal
          isOpen={modalState.type === 'createAppointment'}
          onClose={closeModal}
          timeRange={modalState.data}
          onSubmit={handleBookAppointmentSubmit}
        />
      )}

      {modalState.type === 'editAppointment' && (
        <EditAppointmentModal
          isOpen={modalState.type === 'editAppointment'}
          onClose={closeModal}
          appointment={modalState.data}
          onSubmit={handleBookAppointmentSubmit}
          onCancel={() => openModal('cancelAppointment', modalState.data)}
        />
      )}

      {modalState.type === 'cancelAppointment' && (
        <CancelAppointmentModal
          isOpen={modalState.type === 'cancelAppointment'}
          onClose={closeModal}
          appointment={modalState.data}
          onCancelConfirm={handleCancelAppointmentConfirm}
        />
      )}

      {modalState.type === 'createBlockedTime' && (
        <CreateBlockedTimeModal
          isOpen={modalState.type === 'createBlockedTime'}
          onClose={closeModal}
          timeRange={modalState.data}
          onSubmit={handleBlockTimeSubmit}
        />
      )}

      {modalState.type === 'editBlockedTime' && (
        <EditBlockedTimeModal
          isOpen={modalState.type === 'editBlockedTime'}
          onClose={closeModal}
          blockedTime={modalState.data}
          onSubmit={handleBlockTimeSubmit}
          onCancel={() => openModal('cancelBlockedTime', modalState.data)}
        />
      )}

      {modalState.type === 'cancelBlockedTime' && (
        <CancelBlockedTimeModal
          isOpen={modalState.type === 'cancelBlockedTime'}
          onClose={closeModal}
          blockedTime={modalState.data}
          onCancelConfirm={handleCancelBlockedTimeConfirm}
        />
      )}

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity as 'error' | 'success' | 'info' | 'warning'}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default ProviderCalendarContainer;
