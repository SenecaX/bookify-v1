import React from 'react';
import { Box, Typography } from '@mui/material';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

const AddressSection: React.FC = () => {
  // Fetch company address from redux slice
  const address = useSelector((state: RootState) => state.company.company?.address);

  // Default address in case the address is missing from the store
  const defaultAddress = {
    street: '123 Main Street',
    city: 'City',
    zip: '',
    country: 'Country'
  };

  const displayAddress = address || defaultAddress;

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Our Address
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {displayAddress.street}, {displayAddress.city}, {displayAddress.zip}, {displayAddress.country}
        </Typography>
      </Box>
    </>
  );
};

export default AddressSection;
