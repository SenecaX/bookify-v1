import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/register-customer');
  };

  const handleBookNow = () => {
    navigate('/provider-service-selection');
  };

  return (
    <Box
      sx={{
        width: '100%',  // Full width of the viewport
        bgcolor: 'primary.main',  // Primary color background
        color: 'white',  // White text for contrast
        py: 10,  // Padding to create a more spacious look
        textAlign: 'center',  // Center the text and content
        mx: 0, // Remove any horizontal margins
        px: 0, // Remove any padding
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
        Welcome to Bookify!
      </Typography>
      <Typography variant="h6" paragraph sx={{ maxWidth: '600px', mx: 'auto' }}>
        Manage your appointments effortlessly. Sign up today or book your next appointment with ease.
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ minWidth: '150px', fontWeight: 'bold', color: 'white', borderColor: 'white' }} // Outlined with white
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
