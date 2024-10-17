import React from 'react';
import { Grid, Container, Box } from '@mui/material';
import { IProvider, IService } from '../types';
import { CustomAutocomplete } from '@bookify-v1/shared-components';

interface ProviderServiceUIProps {
  providers: IProvider[];
  services: IService[];
  selectedProvider: IProvider | null;
  selectedService: IService | null;
  handleProviderChange: (event: React.SyntheticEvent, value: IProvider | null) => void;
  handleServiceChange: (event: React.SyntheticEvent, value: IService | null) => void;
}

export const ProviderServiceUI: React.FC<ProviderServiceUIProps> = ({
  providers,
  services,
  selectedProvider,
  selectedService,
  handleProviderChange,
  handleServiceChange,
}) => {
  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={3}>
        <h2>Select a Provider and Service</h2>
      </Box>
      <Grid container spacing={3}>
        {/* Provider Autocomplete */}
        <Grid item xs={12}>
          <CustomAutocomplete
            label="Select Provider"
            options={providers}
            getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
            value={selectedProvider}
            onChange={handleProviderChange}
          />
        </Grid>

        {/* Service Autocomplete */}
        <Grid item xs={12}>
          <CustomAutocomplete
            label="Select Service"
            options={services}
            getOptionLabel={(option: any) => option.name}
            value={selectedService}
            onChange={handleServiceChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
