import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Default storage for web
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import userReducer from './user.slice';
import companyReducer from './company.slice';
import serviceReducer from './service.slice';
import appointmentReducer from './appointment.slice';

// Persist configuration for auth slice
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers if you have multiple slices
const rootReducer = combineReducers({
  auth: authReducer, 
  user: userReducer,
  company: companyReducer,
  service: serviceReducer,
  appointment: appointmentReducer,
});

// Create a persisted reducer using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer and custom middleware
const store = configureStore({
  reducer: persistedReducer,  // Use persistedReducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create the persistor for persisting the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
