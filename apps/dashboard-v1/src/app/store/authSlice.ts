import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { RegisterFormData } from '../types';
import { RootState } from '.';

// Define the shape of the state
interface AuthState {
  authStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  user: {
    userId: string | null;
    email: string | null;
    role: string | null;
    token: string | null;
    expiresIn: number | null;
  };
}

// Initial state
const initialState: AuthState = {
  authStatus: {
    loading: false,
    error: null,
    success: false,
  },
  user: {
    userId: null,
    email: null,
    role: null,
    token: null,
    expiresIn: null,
  },
};

// Async thunk for admin registration
export const registerAdminAsync = createAsyncThunk<
  void,
  RegisterFormData,
  { rejectValue: string }
>(
  'auth/registerAdmin',
  async (data, { rejectWithValue }) => {
    try {
      // Register the admin, replace 'customer' with 'admin' if required
      await api.post('/auth/register', { ...data, role: 'customer' });
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Registration failed');
      } else {
        return rejectWithValue('Network error');
      }
    }
  }
);

// Async thunk for user login
export const loginUserAsync = createAsyncThunk<
  { userId: string; email: string; role: string; token: string; expiresIn: number },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data.data; // Assuming the relevant user data is inside 'data'
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Login failed');
      } else {
        return rejectWithValue('Network error');
      }
    }
  }
);

// Redux slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to reset the entire state
    resetState: () => initialState,
    logout: (state) => {
      state.authStatus.success = false;
      state.user = {
        userId: null,
        email: null,
        role: null,
        token: null,
        expiresIn: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin registration pending
      .addCase(registerAdminAsync.pending, (state) => {
        state.authStatus.loading = true;
        state.authStatus.error = null;
        state.authStatus.success = false;
      })
      // Admin registration fulfilled
      .addCase(registerAdminAsync.fulfilled, (state) => {
        state.authStatus.loading = false;
        state.authStatus.error = null;
        state.authStatus.success = true;
      })
      // Admin registration rejected
      .addCase(registerAdminAsync.rejected, (state, action) => {
        state.authStatus.loading = false;
        state.authStatus.error = action.payload || 'Registration failed';
        state.authStatus.success = false;
      })
      // User login pending
      .addCase(loginUserAsync.pending, (state) => {
        state.authStatus.loading = true;
        state.authStatus.error = null;
        state.authStatus.success = false;
      })
      // User login fulfilled
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.authStatus.loading = false;
        state.authStatus.error = null;
        state.authStatus.success = true;

        // Save the user data into the state
        state.user.userId = action.payload.userId;
        state.user.email = action.payload.email;
        state.user.role = action.payload.role;
        state.user.token = action.payload.token;
        state.user.expiresIn = action.payload.expiresIn;
      })
      // User login rejected
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.authStatus.loading = false;
        state.authStatus.error = action.payload || 'Login failed';
        state.authStatus.success = false;
      });
  },
});

export const selectedProviderId = (state: RootState) => state.auth.user.userId;


// Export actions and reducer
export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;
