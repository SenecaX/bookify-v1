// useCalendarActions.ts

import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import { bookAppointmentAsync, fetchAvailableSlotsAsync } from '../../store/appointment.slice';
import { useCallback } from 'react';

export const useCalendarActions = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  const bookAppointment = useCallback(
    async (customerId: string,providerId: string, serviceId: string, date: string, time: string) => {
      try {
        const response = await dispatch(bookAppointmentAsync({ customerId, providerId, serviceId, date, time }));
        const result = unwrapResult(response);
        return { success: true, data: result }; // Return the booking data on success
      } catch (error: any) {
        return { success: false, error }; // Pass the error object
      }
    },
    [dispatch]
  );

  return {
    fetchAvailableSlots,
    bookAppointment
  };
};
