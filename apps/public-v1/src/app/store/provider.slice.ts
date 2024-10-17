// provider.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProvider } from '../types';
import { getProviders } from '../services/api.service';

interface ProviderState {
  providers: IProvider[];
  loading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  providers: [],
  loading: false,
  error: null,
};

// Async thunk for fetching providers
export const fetchProvidersAsync = createAsyncThunk(
  'providers/fetchProviders',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await getProviders(token);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch providers');
    }
  }
);

const providerSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvidersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvidersAsync.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.loading = false;
      })
      .addCase(fetchProvidersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default providerSlice.reducer;
