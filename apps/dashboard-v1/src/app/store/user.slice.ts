import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ProviderData, User } from '../types';
import { RootState } from '.';
import { createSelector } from 'reselect';
import { logout } from './authSlice';

// Define the shape of the state
interface UserState {
  users: User[];         // All users fetched from the backend
  loading: boolean;      // To track the loading state
  error: string | null;  // To track any error messages
  success: boolean;      // To track success state for operations like creating or editing a user
}

// Initial state
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

// Async thunk for fetching all users
export const fetchUsersAsync = createAsyncThunk<
  User[], 
  void,   
  { rejectValue: string, state: RootState } // Include state type here
>(
  'users/fetchUsers',
  async (_, { rejectWithValue, getState }) => { // Destructure getState
    try {
      const state = getState(); // Get the current state
      const token = state.auth.user.token; // Access the token

      const response = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      }); // Fetches all users

      return response.data.data; // Return the fetched users
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch users');
      }
      return rejectWithValue('Network error');
    }
  }
);


export const createUserAsync = createAsyncThunk<
  { user: User; token: string },   
  User,            
  { rejectValue: string, state: RootState }  
>(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      // Ensure the role is set, if not default to 'provider'
      if (!userData.role) {
        userData.role = 'provider';
      }

      const response = await api.post('/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to create user');
      }
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk for editing a user (providers included)
export const editUserAsync = createAsyncThunk<
  { status: number; code: string; message: string; data: User }, 
  { userId: string; updates: Partial<User> }, 
  { rejectValue: string; state: RootState }
>(
  'users/editUser',
  async ({ userId, updates }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      const response = await api.put(`/users/${userId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to edit user');
      }
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk for deleting a user
export const deleteUserAsync = createAsyncThunk<
  { status: number; code: string; message: string }, 
  string, 
  { rejectValue: string; state: RootState }
>(
  'users/deleteUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.user.token;

      if (!token) {
        return rejectWithValue('Authentication token not available.');
      }

      const response = await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to delete user');
      }
      return rejectWithValue('Network error');
    }
  }
);

// Redux slice for users
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: () => initialState,
    clearStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(logout, () => initialState)
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;  // Populate users with fetched data
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);  // Add the newly registered user
        state.success = true;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create user';
        state.success = false;
      })

      .addCase(editUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUserIndex = state.users.findIndex(user => user._id === action.payload.data._id);
        if (updatedUserIndex >= 0) {
          state.users[updatedUserIndex] = action.payload.data;  // Update user in state
        }
        state.success = true;
      })
      .addCase(editUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
        state.success = false;
      })

      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.meta.arg);  // Remove deleted user
        state.success = true;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
        state.success = false;
      });
  },
});

// Selectors
const getUsers = (state: RootState) => state.user.users;

export const selectProviders = createSelector(
  [getUsers],
  (users) => users.filter(user => user && user.role === 'provider')
);

export const selectCustomers = createSelector(
  [getUsers],
  (users) => users.filter(user => user && user.role === 'customer')
);

export const { resetUserState, clearStatus } = userSlice.actions;
export default userSlice.reducer;


