import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ServiceData } from '../types';
import { RootState } from '.';
import { logout } from './authSlice';

// Define the shape of the state
interface ServiceState {
  services: ServiceData[];   // All services fetched from the backend
  loading: boolean;          // To track the loading state
  error: string | null;      // To track any error messages
  success: boolean;          // To track success state for operations like creating or editing a service
}

// Initial state
const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
  success: false,
};

// Selector to filter services from the store
export const selectServices = (state: RootState) => state.service.services;

// Async thunk for fetching all services
export const fetchServicesAsync = createAsyncThunk<
  ServiceData[], 
  void, 
  { rejectValue: string, state: RootState }
>(
  'services/fetchServices',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token; // Fetch token from state

      const response = await api.get('/services', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });

      return response.data.data; // Return fetched services
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch services');
      }
      return rejectWithValue('Network error');
    }
  }
);


// Async thunk for creating a new service
// Async thunk for creating a new service
export const createServiceAsync = createAsyncThunk<
  ServiceData,  // Returning just the ServiceData
  ServiceData,  // Accepting ServiceData as input
  { rejectValue: string, state: RootState }
>(
  'services/createService',
  async (serviceData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      const response = await api.post('/services', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return just the service data
      return response.data.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to create service');
      }
      return rejectWithValue('Network error');
    }
  }
);


// Async thunk for editing an existing service
export const editServiceAsync = createAsyncThunk<
  { status: number; code: string; message: string; data: ServiceData },
  { serviceId: string; updates: Partial<ServiceData> },
  { rejectValue: string, state: RootState }
>(
  'services/editService',
  async ({ serviceId, updates }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      const response = await api.put(`/services/${serviceId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to edit service');
      }
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk for deleting a service
export const deleteServiceAsync = createAsyncThunk<
  { status: number; code: string; message: string },
  string,
  { rejectValue: string, state: RootState }
>(
  'services/deleteService',
  async (serviceId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      const response = await api.delete(`/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to delete service');
      }
      return rejectWithValue('Network error');
    }
  }
);

// Redux slice for services
const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    resetServiceState: () => initialState,
    clearServiceStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(logout, () => initialState)
      // Fetch services
      .addCase(fetchServicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;  // Populate services with fetched data
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch services';
      })

      // Create service
      .addCase(createServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload); 
        state.success = true;
      })
      .addCase(createServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create service';
        state.success = false;
      })

      // Edit service
      .addCase(editServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedServiceIndex = state.services.findIndex(service => service._id === action.payload.data._id);
        if (updatedServiceIndex >= 0) {
          state.services[updatedServiceIndex] = action.payload.data;  // Update service in state
        }
        state.success = true;
      })
      .addCase(editServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update service';
        state.success = false;
      })

      // Delete service
      .addCase(deleteServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service._id !== action.meta.arg);  // Remove deleted service
        state.success = true;
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete service';
        state.success = false;
      });
  },
});

export const selectAllServices = (state: RootState) => state.service.services;


export const { resetServiceState, clearServiceStatus } = serviceSlice.actions;
export default serviceSlice.reducer;
