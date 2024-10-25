import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { theme } from '@bookify-v1/shared';
import { useNavigate } from 'react-router-dom'; // Assuming react-router is used

const boxStyles = {
  textAlign: 'center',
  mt: { xs: 5, md: 10 },
  px: 2,
  maxWidth: '1100px',
  mx: 'auto',
  py: 10,
};

const titleStyles = {
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  mb: 6,
  fontSize: {
    xs: '2rem',
    sm: '3rem',
    md: '3.5rem',
  },
};

const subtitleStyles = {
  color: theme.palette.primary.main,
  mb: 4,
  fontSize: '2rem',
};

const descriptionStyles = {
  color: theme.palette.text.secondary,
  fontSize: '1.25rem',
  maxWidth: 700,
  mx: 'auto',
  mb: 6,
};

const buttonStyles = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  px: 6,
  py: 3,
  borderRadius: '8px',
  fontSize: '1.2rem',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  mb: 6,
};

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTestAppClick = () => {
    window.open('https://test.dashboard.instabooking.xyz', '_blank'); // Opens in a new tab
  };  

  return (
    <Box sx={boxStyles}>
      <Typography variant="h2" sx={titleStyles}>
      Start Managing Your Bookings Effortlessly.
      </Typography>
      <Typography variant="h5" sx={subtitleStyles}>
      Simplifying Appointment Scheduling for Your Business.
      </Typography>
      <Button 
        variant="contained" 
        sx={buttonStyles} 
        onClick={handleTestAppClick}
      >
        Test the App
      </Button>
    </Box>
  );
};

export default HeroSection;
