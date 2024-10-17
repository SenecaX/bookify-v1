// src/routesConfig.tsx

import LoginContainer from './containers/LoginContainer';
import RegistrationContainer from './containers/RegistrationContainer';
import BookingConfirmation from './pages/BookingConfirmation';
import AppointmentCalendar from './pages/Calendar/AppointmentCalendar';
import Home from './pages/Home';
import ProviderServiceSelection from './pages/ProviderServiceSelection';

export interface RouteConfig {
  path: string;
  component: JSX.Element;
  protected: boolean;  // Defines if the route is protected
}

const routesConfig: RouteConfig[] = [
  { path: '/', component: <Home />, protected: false },
  { path: '/login', component: <LoginContainer />, protected: false },
  { path: '/register-customer', component: <RegistrationContainer />, protected: false },
  { path: '/provider-service-selection', component: <ProviderServiceSelection />, protected: true },
  { path: '/appointment-calendar', component: <AppointmentCalendar />, protected: true },
  { path: '/confirm-booking', component: <BookingConfirmation />, protected: true },
];

export default routesConfig;
