import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.auth ); // Adjust based on your auth state

  // Check if the user is authenticated (e.g., a token is present)
  const isAuthenticated = !!user.token;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
