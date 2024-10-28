import { theme } from '@bookify-v1/shared';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './containers/Home';
import LoginContainer from './containers/LoginContainer';
import DashboardLayout from './drawer/DashboardLayout';
import ProviderCalendar from './pages/Calendar/ProviderCalendarContainer';
import ProvidersPage from './pages/ProvidersPage';
import ServicesPage from './pages/ServicesPage';
import UsersPage from './pages/UsersPage';
import AppointmentContainer from './appointmentscreen/AppointmentContainer';


const App: React.FC = () => {

  return (
        <ThemeProvider theme={theme}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginContainer />} />


            {/* Protected Routes that use DashboardLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Nested routes inside DashboardLayout */}
              <Route path="home" element={<Home />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/calendar" element={<ProviderCalendar />} />
            <Route path="/appointments" element={ <AppointmentContainer />} />


              {/* Add more routes like /settings, /notifications here */}
            </Route>
          </Routes>
        </ThemeProvider>
  );
};

export default App;
