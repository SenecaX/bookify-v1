import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';  // Default storage for web
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import companyReducer from './companySlice';  // Import the company reducer

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers, adding companySlice
const rootReducer = combineReducers({
  auth: authReducer, 
  company: companyReducer,  // Add the company reducer to the root reducer
});

// Create a persisted reducer using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer and custom middleware
const store = configureStore({
  reducer: persistedReducer,  // Use persistedReducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],  // Ignore these actions for serializability checks
      },
    }),
});

// Create the persistor for persisting the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
