import { unwrapResult } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import {
  blockProviderTimeAsync,
  bookAppointmentAsync,
  cancelAppointmentAsync,
  cancelBlockedTimeAsync,
  editAppointmentAsync,
  fetchAppointmentsAsync,
  fetchAvailableSlotsAsync,
  fetchBlockedTimesAsync
} from '../../store/appointment.slice';

export const useCalendarActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch available slots for a provider and service on a specific date
  const fetchAvailableSlots = useCallback(
    async (providerId: string, serviceId: string, date: string) => {
      try {
        const response = await dispatch(fetchAvailableSlotsAsync({ providerId, serviceId, date }));
        unwrapResult(response);
        return { success: true, data: response.payload }; // Return the available slots
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );

  // Book an appointment for a provider, service, date, and time
  const bookAppointment = useCallback(
    async (customerId: string, providerId: string, serviceId: string, date: string, time: string) => {
      try {
        const response = await dispatch(bookAppointmentAsync({ customerId, providerId, serviceId, date, time }));
        const result = unwrapResult(response);
        console.log('Result after booking:', result); // Debug log
        return { success: true, data: result };
      } catch (error: any) {
        console.error('Error during booking:', error); // Debug log
        return { success: false, error };
      }
    },
    [dispatch]
  );  

  // Fetch appointments for a specific date range
// Updated fetchAppointments function
const fetchAppointments = useCallback(
  async (start: string, end: string) => {
    try {
      const response = await dispatch(fetchAppointmentsAsync({ start, end }));
      const result = unwrapResult(response);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error };
    }
  },
  [dispatch]
);


  // Fetch blocked times for a provider
  const fetchBlockedTimes = useCallback(
    async (providerId: string, start: string, end: string) => {
      try {
        const response = await dispatch(fetchBlockedTimesAsync({ providerId, start, end }));
        const result = unwrapResult(response);
        return { success: true, data: result }; // Return the blocked times
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );
  
  // Block a time slot for a provider
  const blockTime = useCallback(
    async (providerId: string, startTime: string, endTime: string, reason?: string) => {
      try {
        const response = await dispatch(blockProviderTimeAsync({ providerId, startTime, endTime, reason }));
        const result = unwrapResult(response);
        return { success: true, data: result }; // Return the blocked time data on success
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );

  const cancelAppointment = useCallback(
    async (appointmentId: string, reason: string) => {
      try {
        const response = await dispatch(cancelAppointmentAsync({ appointmentId, reason }));
        const result = unwrapResult(response);
        return { success: true, data: result }; // Return the result of cancellation
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );

  const cancelBlockedTime = useCallback(
    async (blockedTimeId: string, reason: string) => {
      try {
        const response = await dispatch(cancelBlockedTimeAsync({ blockedTimeId, reason }));
        const result = unwrapResult(response);
        return { success: true, data: result }; // Return the result of blocked time cancellation
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );

  const editAppointment = useCallback(
    async (appointmentId: string, customerId: string, providerId: string, serviceId: string, date: string, time: string) => {
      try {
        const response = await dispatch(editAppointmentAsync({ appointmentId, customerId, providerId, serviceId, date, time }));
        const result = unwrapResult(response);
        console.log('Result after editing appointment:', result); // Debug log
        return { success: true, data: result };
      } catch (error: any) {
        console.error('Error during editing appointment:', error); // Debug log
        return { success: false, error };
      }
    },
    [dispatch]
  );
  

  return {
    fetchAvailableSlots,
    bookAppointment,
    fetchAppointments,
    fetchBlockedTimes,  
    blockTime,
    cancelAppointment,
    cancelBlockedTime,
    editAppointment
  };
};
