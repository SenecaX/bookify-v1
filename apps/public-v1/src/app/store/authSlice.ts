import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegistrationFormData, User } from '../types';
import api from '../services/api';
import { RootState } from '.';

// Define the shape of the state
interface AuthState {
  authStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  user: User | null; // Now using the `User` type directly, or `null` when unauthenticated
}

// Initial state
const initialState: AuthState = {
  authStatus: {
    loading: false,
    error: null,
    success: false,
  },
  user: null,
};


// Async thunk for admin registration
export const registerAdminAsync = createAsyncThunk<
  void,
  RegistrationFormData,
  { rejectValue: string }
>(
  'auth/registerAdmin',
  async (data, { rejectWithValue }) => {
    try {
      // Register the admin, replace 'customer' with 'admin' if required
      await api.post('/auth/register', { ...data, role: 'customer' });
    } catch (err: any) {
      console.log('err', err); // Log for debugging
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
User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/customer', data);
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

export const updateUserProfileAsync = createAsyncThunk<
  User, // The updated user data returned from the API
  Partial<User>, // The user data we are sending for the update
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (updates, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.userId;
      const token = state.auth.user?.token;

      if (!userId) {
        return rejectWithValue('User ID not found');
      }

      if (!token) {
        return rejectWithValue('Authorization token is missing');
      }

      // Make the API call with Authorization header
      const response = await api.put(
        `/users/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response.data", response.data)


      return response.data.data as User; // Assuming API response contains the updated user in `data`
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Profile update failed');
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
    logout(state) {
      // Reset the auth state to initial state
      state.authStatus = {
        loading: false,
        error: null,
        success: false,
      };
      state.user = null;      
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
        state.user = action.payload;
      })
      
      // User login rejected
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.authStatus.loading = false;
        state.authStatus.error = action.payload || 'Login failed';
        state.authStatus.success = false;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        console.log("action payload in fulfilled", action.payload);
      
        // Update only the fields returned in action.payload
        state.user = {
          ...state.user, // Preserve existing properties
          ...action.payload, // Update only fields present in payload
        } as User; // Ensure type safety with `User`
      
        state.authStatus.success = true;
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.authStatus.error = action.payload || 'Failed to update profile';
        state.authStatus.success = false;
      });
  },
});

// Export actions and reducer
export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;
