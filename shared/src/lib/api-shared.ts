// shared/api-shared.ts
const API_URL = import.meta.env["VITE_REACT_APP_API_URL"];

// Service APIs
export const fetchServicesApi = (companyId?: string) =>
  companyId ? `${API_URL}/services?companyId=${companyId}` : `${API_URL}/services`;
export const createServiceApi = (companyId: string) => `${API_URL}/company/${companyId}/services`;
export const updateServiceApi = (serviceId: string) => `${API_URL}/services/${serviceId}`;
export const deleteServiceApi = (serviceId: string) => `${API_URL}/services/${serviceId}`;

// User APIs
export const loginUserApi = () => `${API_URL}/login`;
export const fetchUsersApi = () => `${API_URL}/users`;
export const fetchUserByIdApi = (userId: string) => `${API_URL}/users/${userId}`;
export const createUserApi = () => `${API_URL}/users`;
export const updateUserApi = (userId: string) => `${API_URL}/users/${userId}`;
export const deleteUserApi = (userId: string) => `${API_URL}/users/${userId}`;

// Provider APIs
export const fetchProvidersApi = (companyId: string) => `${API_URL}/company/${companyId}/providers`;
export const createProviderApi = (companyId: string) => `${API_URL}/company/${companyId}/providers`;
export const updateProviderApi = (providerId: string) => `${API_URL}/providers/${providerId}`;
export const deleteProviderApi = (providerId: string) => `${API_URL}/providers/${providerId}`;

export const fetchAppointmentsByCompanyApi = (companyId: string, startDate: string, endDate?: string) => {
  const url = endDate 
    ? `${API_URL}/companies/${companyId}/appointments?startDate=${startDate}&endDate=${endDate}` 
    : `${API_URL}/companies/${companyId}/appointments?startDate=${startDate}`;
  return url;
};


// Customer User APIs
export const registerCustomerUserApi = () => `${API_URL}/customer/register`;
export const loginCustomerUserApi = () => `${API_URL}/customer/login`;
export const fetchCustomersByCompanyApi = (companyId: string) => `${API_URL}/customers?companyId=${companyId}`; // New endpoint
export const updateCustomerUserApi = (userId: string) => `${API_URL}/customer/${userId}`;
export const deleteCustomerUserApi = (userId: string) => `${API_URL}/customer/${userId}`;
export const guestSessionApi = () => `${API_URL}/customer/guestSession`;
export const getUserAppointmentsApi = (userId: string) => `${API_URL}/customer/${userId}/appointments`;


// Appointment APIs
export const createAppointmentApi = () => `${API_URL}/appointments`;
export const updateAppointmentApi = (appointmentId: string) => `${API_URL}/appointments/${appointmentId}`;

export const createReviewApi = () => `${API_URL}/reviews`;


// shared/api-shared.ts
export const checkCompanyLoginApi = () => `${API_URL}/checkCompanyLogin`;
export const ownerRegistrationApi = () => `${API_URL}/ownerRegistration`;

export const fetchCompanyServicesApi = (companyId: string) => `${API_URL}/company/${companyId}/services`;

export const fetchCompanyProvidersApi = (companyId: string) => `${API_URL}/company/${companyId}/providers`;
export const updateWorkingHoursApi = (companyId: string) => `${API_URL}/updateWorkingHours/${companyId}`;
