import { ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { fetchCompanyByNameAsync } from './store/company.slice';
import { theme } from '@bookify-v1/shared';
import routesConfig from './routesConfig';  // Import the routes configuration
import Layout from './pages/Layout';
import ProtectedRoute from './components/ProtectedRoute';  // Ensure this component is accessible

const companyName = window.location.hostname.split('.')[0]; // Extract subdomain

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCompanyByNameAsync(companyName));
  }, [dispatch, companyName]);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {routesConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout>
                {route.protected ? (
                  <ProtectedRoute>{route.component}</ProtectedRoute>
                ) : (
                  route.component
                )}
              </Layout>
            }
          />
        ))}
      </Routes>
    </ThemeProvider>
  );
};

export default App;
