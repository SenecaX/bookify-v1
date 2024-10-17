import { theme } from '@bookify-v1/shared';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import CompanyHours from './pages/CompanyHours';
import CompanyRegistrationContainer from './containers/CompanyRegistrationContainer';
import AdminRegistrationContainer from './containers/RegistrationContainer';
import LandingPage from './pages/LandingPage';
import store from './store';
import CompanyHoursSetup from './pages/CompanyHoursSetup/CompanyHoursSetup';
import WelcomeMessage from './pages/WelcomeMessage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/register-admin" element={<AdminRegistrationContainer />} />
          <Route path="/company-hours" element={<CompanyHoursSetup />} />
          <Route path="/company-registration" element={<CompanyRegistrationContainer />} />
          <Route path="/welcome" element={<WelcomeMessage />} />
        </Routes>
      </ThemeProvider>
      </Provider>
  );
};

export default App;
