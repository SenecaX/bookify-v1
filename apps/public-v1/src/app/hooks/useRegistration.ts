import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { RegistrationFormData } from '../types';
import { registerAdminAsync } from '../store/authSlice';
import { selectCompanyId } from '../store/company.slice';
export const useRegistration = () => {
  const dispatch = useDispatch<AppDispatch>();


  const companyId = useSelector(selectCompanyId);

  console.log("companyId", companyId)

  const registerAdmin = (data: RegistrationFormData) => {
   

    if (companyId) {
      const dataWithCompanyId = {
        ...data,
        companyId, // Append companyId to the form data
      };

      dispatch(registerAdminAsync(dataWithCompanyId));
    } else {
      console.error('No companyId available');
    }
  };

  return { registerAdmin };
};
