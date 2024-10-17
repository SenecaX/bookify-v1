import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders, getServices } from '../services/api.service';
import { IProvider, IService } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ProviderServiceUI } from '../components/ProviderServiceUI';
import { Button, Box } from '@mui/material'; // Importing MUI components

export const ProviderServiceSelection: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<IProvider | null>(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const token = useSelector((state: RootState) => state.auth.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const providersData = await getProviders(token);
          const servicesData = await getServices(token);
          setProviders(Array.isArray(providersData.data) ? providersData.data : []);
          setServices(Array.isArray(servicesData.data) ? servicesData.data : []);
        } else {
          console.error('No token available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [token]);

  // Navigate when both provider and service are selected
  const handleNavigate = () => {
    if (selectedProvider && selectedService) {
      navigate(`/appointment-calendar?providerId=${selectedProvider._id}&serviceId=${selectedService._id}`);
    }
  };

  return (
    <>
      <ProviderServiceUI
        providers={providers}
        services={services}
        selectedProvider={selectedProvider}
        selectedService={selectedService}
        handleProviderChange={(event, value) => setSelectedProvider(value)}
        handleServiceChange={(event, value) => setSelectedService(value)}
      />
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          onClick={handleNavigate}
          disabled={!selectedProvider || !selectedService}
          variant="contained"
          color="primary"
          sx={{
            padding: '12px 24px',
            fontWeight: 'bold',
            borderRadius: '8px',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'primary.dark', // Hover state for better interaction
            },
            '&:disabled': {
              backgroundColor: '#d3d3d3', // Gray color for disabled state
              cursor: 'not-allowed',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </>
  );
};

export default ProviderServiceSelection;
