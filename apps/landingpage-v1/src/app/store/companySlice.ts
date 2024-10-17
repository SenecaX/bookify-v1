import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { CompanyRegistrationFormData } from '../types';  // Company form data type
import { RootState } from './index';

// Define the shape of the company state
interface CompanyState {
  companyStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  companyId: string | null;
}

// Initial state
const initialState: CompanyState = {
  companyStatus: {
    loading: false,
    error: null,
    success: false,
  },
  companyId: null,  // This will be updated when a company is created
};

export const registerCompanyAsync = createAsyncThunk<
  { companyId: string },
  { data: CompanyRegistrationFormData; userId: string },
  { rejectValue: string, state: RootState }
>(
  'company/registerCompany',
  async ({ data, userId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      const response = await api.post('/company', {
        ...data,
        adminId: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Company registration response:', response.data);

      return response.data.data;

    } catch (err: any) {

      if (err.response) {
        console.error('Axios response data:', err.response.data);
        return rejectWithValue(err.response.data.message || 'Company registration failed');
      } else {
        return rejectWithValue('Network error');
      }
    }
  }
);

export const updateCompanyAsync = createAsyncThunk<
  { companyId: string },
  { companyId: string, data: CompanyRegistrationFormData; userId: string },
  { rejectValue: string, state: RootState }
>(
  'company/updateCompany',
  async ({ companyId, data, userId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      // Adjust the payload to match the backend schema
      const formattedData = {
        workingHours: data.workingHours.map((wh: any) => ({
          day: wh.day,
          isDayOn: wh.isDayOn,
          start: wh.start,
          end: wh.end,
          breaks: wh.breaks,
        })),
        adminId: userId,
      };

      // Make a PUT request to update the company details
      const response = await api.put(`/company/${companyId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;

    } catch (err: any) {

      if (err.response) {
        console.error('Axios response data:', err.response.data);
        return rejectWithValue(err.response.data.message || 'Company update failed');
      } else {
        return rejectWithValue('Network error');
      }
    }
  }
);

// Redux slice definition
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Company registration pending
      .addCase(registerCompanyAsync.pending, (state) => {
        state.companyStatus.loading = true;
        state.companyStatus.error = null;
        state.companyStatus.success = false;
      })
      // Company registration fulfilled
      .addCase(registerCompanyAsync.fulfilled, (state, action) => {
        console.log('Company registration fulfilled:', action.payload);
        state.companyStatus.loading = false;
        state.companyStatus.error = null;
        state.companyStatus.success = true;
        state.companyId = (action.payload as unknown as { _id: string })._id;  // Cast to ensure _id exists
      })
      // Company registration rejected
      .addCase(registerCompanyAsync.rejected, (state, action) => {
        state.companyStatus.loading = false;
        state.companyStatus.error = action.payload || 'Company registration failed';
        state.companyStatus.success = false;
      });
  },
});

// Export actions and reducer
export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;
