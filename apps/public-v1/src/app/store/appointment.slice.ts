import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import api from '../services/api';
import { IAppointment } from '../types';

interface AppointmentState {
  availableSlots: string[];
  appointments: IAppointment[]
  loading: boolean; // New loading state
  error: string | null;
}

// Define the initial state for the appointment slice
const initialState: AppointmentState = {
  availableSlots: [],
  appointments: [],
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
  string[],  // Type of the returned data (array of strings for time slots)
  FetchAvailableSlotsParams,  // The parameters for the API request
  { rejectValue: string, state: RootState }  // Additional typing for reject and state
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
      const response = await api.get(`/appointments/${providerId}/availability`, {
        params: { serviceId, date },
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      // Ensure the response has valid data
      const data = response?.data?.data;

      if (!data || !Array.isArray(data.availableSlots)) {
        return rejectWithValue('Invalid data format received from server');
      }

      return data.availableSlots;  // Return the array of available slots
    } catch (err: any) {
      // Handle both network errors and API response errors
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch available slots');
      }
      return rejectWithValue('Network error');
    }
  }
);

export const bookAppointmentAsync = createAsyncThunk<
  { message: string, data?: any },  // Type of the returned data on success
  {customerId:string,  providerId: string, serviceId: string, date: string, time: string },  // Parameters for the API request
  { rejectValue: string, state: RootState }  // Additional typing for reject and state
>(
  'appointment/bookAppointment',
  async ({ customerId, providerId, serviceId, date, time }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.post('/appointments/book', {
        customerId,
        providerId,
        serviceId,
        date,
        time,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = response?.data;

      if (!data) {
        return rejectWithValue('Failed to book appointment');
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to book appointment');
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
        console.log("action", action.payload);
        // state.appointments = action.payload.data; // Assuming payload contains data on successful booking
        state.loading = false;
        state.error = null;
      })
      .addCase(bookAppointmentAsync.rejected, (state, action) => {
        state.appointments = [];
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

  },
});

export default appointmentSlice.reducer;

// Selectors
export const selectAvailableSlots = (state: RootState) => state.appointment.availableSlots;
export const selectAppointmentError = (state: RootState) => state.appointment.error;
export const selectLoadingState = (state: RootState) => state.appointment.loading; // New loading selector
