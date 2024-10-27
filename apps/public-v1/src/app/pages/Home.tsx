import React, { useEffect } from 'react';
import { Grid, Container, Box } from '@mui/material';
import WorkingHours from './WorkingHours';
import AddressSection from './AddressSection';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProvidersAsync } from '../store/provider.slice';
import { fetchServicesAsync } from '../store/service.slice';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.user?.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchProvidersAsync(token));
      dispatch(fetchServicesAsync(token));
    }
  }, [token, dispatch]);
  
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <WorkingHours />
          </Grid>
          <Grid item xs={12} md={6}>
            <AddressSection />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
