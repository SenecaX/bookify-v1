import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Default storage for web
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer, { logout } from './authSlice';
import companyReducer from './company.slice';
import appointmentReducer from './appointment.slice';
import providerReducer from './provider.slice';
import serviceReducer from './service.slice';
// Persist configuration for auth slice
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  appointment: appointmentReducer,
  service: serviceReducer,
  provider: providerReducer,
});

// Root reducer that resets the state on logout
const rootReducer = (state: any, action: any) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


// Create the store with the persisted reducer and custom middleware
const store = configureStore({
  reducer: persistedReducer,
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
