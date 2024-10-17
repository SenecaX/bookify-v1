import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, authStatus } = useSelector((state: any) => state.auth);

  // Check if the user is authenticated based on the token and successful login
  const isAuthenticated = !!user.token && authStatus.success;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
