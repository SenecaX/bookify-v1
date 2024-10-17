import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { RootState } from '.';
import { CompanyData } from '../types';

interface CompanyState {
  company: CompanyData | null;  // Typed based on the DTO
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  loading: false,
  error: null,
};

export const selectCompanyId = (state: RootState): string | undefined => {
  return state.company.company?._id; // Returns company._id if it exists, otherwise undefined
};


// Async thunk to fetch company by name with token authentication
export const fetchCompanyByNameAsync = createAsyncThunk<
  CompanyData,  // Type of the returned data
  string,  // The company name passed as a parameter
  { rejectValue: string, state: RootState }
>(
  'company/fetchCompanyByName',
  async (companyName, { rejectWithValue }) => {
    try {

      // Make the API request with the token in the Authorization header
      const response = await api.get(`/company/${companyName}`, {
      });

      return response.data.data as CompanyData;  // Return the fetched company data with correct typing
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch company');
      }
      return rejectWithValue('Network error');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyByNameAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyByNameAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;  // Save company data in state with proper typing
      })
      .addCase(fetchCompanyByNameAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch company';
      });
  },
});

export default companySlice.reducer;
