import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { CompanyRegistrationFormData } from '../types';  // Type for form data
import { registerCompanyAsync } from '../store/companySlice';

export const useCompanyRegistration = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get the userId from the Redux store
  const { userId } = useSelector((state: RootState) => state.auth.user);

  // Function to handle company registration
  const registerCompany = (data: CompanyRegistrationFormData) => {
    if (userId) {
      dispatch(registerCompanyAsync({ data, userId }));  // Dispatch action with both form data and userId
    } else {
      console.error("User ID is missing");
    }
  };

  return { registerCompany };
};
