import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { LoginFormData } from '../types';
import { loginUserAsync } from '../store/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loginUser = (data: LoginFormData) => {
    dispatch(loginUserAsync({ ...data }));
  };

  return { loginUser };
};
