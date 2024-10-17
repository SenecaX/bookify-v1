// service.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IService } from '../types';
import { getServices } from '../services/api.service';

interface ServiceState {
  services: IService[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunk for fetching services
export const fetchServicesAsync = createAsyncThunk(
  'services/fetchServices',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await getServices(token);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch services');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
