import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import api from '../services/api';
import { IAppointment, IBlockedTime } from '../types';
import { logout } from './authSlice';

interface AppointmentState {
  availableSlots: string[];
  appointments: IAppointment[];
  blockedTimes: IBlockedTime[]; // New state for blocked times
  loading: boolean; // New loading state
  error: string | null;
}

// Define the initial state for the appointment slice
const initialState: AppointmentState = {
  availableSlots: [],
  appointments: [],
  blockedTimes: [], // Initialize as an empty array
  loading: false, // Initially not loading
  error: null,
};

// Define types for the thunk response and parameters
interface FetchAvailableSlotsParams {
  providerId: string;
  serviceId: string;
  date: string;
}

// Async thunk to fetch available slots
export const fetchAvailableSlotsAsync = createAsyncThunk<
  string[], // Type of the returned data (array of strings for time slots)
  FetchAvailableSlotsParams, // The parameters for the API request
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/fetchAvailableSlots',
  async ({ providerId, serviceId, date }, { rejectWithValue, getState }) => {
    try {
      // Get the token from the auth state (if needed)
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      // Make the API request with the token in the Authorization header
      const response = await api.get(
        `/appointments/${providerId}/availability`,
        {
          params: { serviceId, date },
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );

      // Ensure the response has valid data
      const data = response?.data?.data;

      if (!data || !Array.isArray(data.availableSlots)) {
        return rejectWithValue('Invalid data format received from server');
      }

      return data.availableSlots; // Return the array of available slots
    } catch (err: any) {
      // Handle both network errors and API response errors
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to fetch available slots'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

export const bookAppointmentAsync = createAsyncThunk<
  { message: string; data?: any }, // Type of the returned data on success
  {
    customerId: string;
    providerId: string;
    serviceId: string;
    date: string;
    time: string;
  }, // Parameters for the API request
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/bookAppointment',
  async (
    { customerId, providerId, serviceId, date, time },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.post(
        '/appointments/book',
        {
          customerId,
          providerId,
          serviceId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to book appointment');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to book appointment'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk to fetch appointments for a provider
export const fetchAppointmentsAsync = createAsyncThunk<
  IAppointment[],
  { start: string; end: string; status?: string[], providerId?: string }, // Add optional status array
  { rejectValue: string; state: RootState }
>(
  'appointment/fetchAppointments',
  async ({ start, end, status = [], providerId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      // Include status in params if provided
      const response = await api.get(`/appointments`, {
        params: {
          start,
          end,
          providerId,
          ...(status.length > 0 && { status: status.join(',') }) // Join status array if it's not empty
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response?.data.data;

      if (!data || !Array.isArray(data)) {
        return rejectWithValue('Invalid data format received from server');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to fetch appointments'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);


// Thunk to block time for a provider
export const blockProviderTimeAsync = createAsyncThunk<
  { message: string; data?: IBlockedTime }, // Type of returned data on success
  { providerId: string; startTime: string; endTime: string; reason?: string }, // Parameters for the API
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/blockProviderTime',
  async (
    { providerId, startTime, endTime, reason },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.post(
        `/appointments/providers/${providerId}/block-time`,
        {
          startTime,
          endTime,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to block time');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to block time'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

// Thunk to fetch blocked times for a provider
export const fetchBlockedTimesAsync = createAsyncThunk<
  IBlockedTime[], // Type of the returned data (array of blocked times)
  { providerId: string; start: string; end: string }, // The parameters for the API request (with date range)
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/fetchBlockedTimes',
  async ({ providerId, start, end }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      // Make the API request to fetch blocked times with date range
      const response = await api.get(
        `/appointments/providers/${providerId}/blocked-times`,
        {
          params: { start, end }, // Pass start and end date as query parameters
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data;

      if (!data || !Array.isArray(data)) {
        return rejectWithValue('Invalid data format received from server');
      }

      return data; // Return the array of blocked times
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to fetch blocked times'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

export const cancelAppointmentAsync = createAsyncThunk<
  { message: string; data?: IAppointment }, // Type of returned data on success
  { appointmentId: string; reason: string }, // Parameters for the API
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/cancelAppointment',
  async ({ appointmentId, reason }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.put(
        `/appointments/${appointmentId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to cancel appointment');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to cancel appointment'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

export const cancelBlockedTimeAsync = createAsyncThunk<
  { message: string; data?: IBlockedTime }, // Type of returned data on success
  { blockedTimeId: string; reason: string }, // Parameters for the API
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/cancelBlockedTime',
  async ({ blockedTimeId, reason }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.put(
        `/blocked-times/${blockedTimeId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to cancel blocked time');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to cancel blocked time'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

export const editAppointmentAsync = createAsyncThunk<
  { message: string; data?: any }, // Type of the returned data on success
  {
    appointmentId: string;
    customerId: string;
    providerId: string;
    serviceId: string;
    date: string;
    time: string;
  }, // Parameters for the API request
  { rejectValue: string; state: RootState } // Additional typing for reject and state
>(
  'appointment/editAppointment',
  async (
    { appointmentId, customerId, providerId, serviceId, date, time },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.put(
        `/appointments/${appointmentId}`,
        {
          customerId,
          providerId,
          serviceId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to edit appointment');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(
          err.response.data.message || 'Failed to edit appointment'
        );
      }
      return rejectWithValue('Network error');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(fetchAvailableSlotsAsync.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.error = null;
      })
      .addCase(fetchAvailableSlotsAsync.fulfilled, (state, action) => {
        state.availableSlots = action.payload; // Set available slots
        state.loading = false; // Clear loading state
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAvailableSlotsAsync.rejected, (state, action) => {
        state.availableSlots = []; // Clear available slots on error
        state.loading = false; // Clear loading state
        state.error = action.payload || 'Unknown error'; // Set error message
      })
      .addCase(bookAppointmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointmentAsync.fulfilled, (state, action) => {
        state.appointments.push(action.payload.data); // Assuming payload contains data on successful booking
        state.loading = false;
        state.error = null;
      })
      .addCase(bookAppointmentAsync.rejected, (state, action) => {
        state.appointments = [];
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(fetchAppointmentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsAsync.fulfilled, (state, action) => {
        state.appointments = action.payload; // Overwrites the existing appointments array
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAppointmentsAsync.rejected, (state, action) => {
        state.appointments = []; // Clear appointments on error
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })

      // Handle blockProviderTimeAsync states
      .addCase(blockProviderTimeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockProviderTimeAsync.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.blockedTimes = [...state.blockedTimes, action.payload.data];
        }
        state.loading = false;
        state.error = null;
      })

      .addCase(blockProviderTimeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to block time';
      })
      // Handle fetchBlockedTimesAsync states
      .addCase(fetchBlockedTimesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedTimesAsync.fulfilled, (state, action) => {
        state.blockedTimes = action.payload; // Replace blocked times with the fetched ones
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBlockedTimesAsync.rejected, (state, action) => {
        state.blockedTimes = []; // Clear blocked times on error
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(cancelAppointmentAsync.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous errors
      })
      .addCase(cancelAppointmentAsync.fulfilled, (state, action) => {
        const canceledAppointmentId = action.meta.arg.appointmentId;

        // Filter out the canceled appointment from the appointments list
        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== canceledAppointmentId
        );

        state.loading = false; // Clear loading state
        state.error = null; // Clear any previous errors
      })
      .addCase(cancelAppointmentAsync.rejected, (state, action) => {
        state.loading = false; // Clear loading state
        state.error = action.payload || 'Failed to cancel appointment'; // Set error message
      })
      .addCase(cancelBlockedTimeAsync.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous errors
      })
      .addCase(cancelBlockedTimeAsync.fulfilled, (state, action) => {
        const canceledBlockedTimeId = action.meta.arg.blockedTimeId;

        // Filter out the canceled blocked time from the blockedTimes list
        state.blockedTimes = state.blockedTimes.filter(
          (blockedTime) => blockedTime._id !== canceledBlockedTimeId
        );

        state.loading = false; // Clear loading state
        state.error = null; // Clear any previous errors
      })
      .addCase(cancelBlockedTimeAsync.rejected, (state, action) => {
        state.loading = false; // Clear loading state
        state.error = action.payload || 'Failed to cancel blocked time'; // Set error message
      })
      .addCase(editAppointmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAppointmentAsync.fulfilled, (state, action) => {
        // Assuming you want to update the specific appointment in state.appointments array
        const updatedAppointment = action.payload.data;
        const index = state.appointments.findIndex(
          (app) => app._id === updatedAppointment._id
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(editAppointmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default appointmentSlice.reducer;

// Selectors
export const selectAvailableSlots = (state: RootState) =>
  state.appointment.availableSlots;
export const selectAppointmentError = (state: RootState) =>
  state.appointment.error;
export const selectLoadingState = (state: RootState) =>
  state.appointment.loading; // New loading selector
export const selectAppointments = (state: RootState) =>
  state.appointment.appointments;
export const selectBlockedTimes = (state: RootState) =>
  state.appointment.blockedTimes;
