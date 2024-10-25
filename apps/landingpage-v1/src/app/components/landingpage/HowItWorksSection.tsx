import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { theme } from '@bookify-v1/shared';

const steps = [
  { title: 'Sign Up', description: 'Create your account in minutes.' },
  { title: 'Set Up Services', description: 'Define your services and availability.' },
  { title: 'Start Booking', description: 'Let clients book your services 24/7.' },
];

// Extract step card styles
const stepCardStyles = {
  p: 4, // Padding for space inside each card
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px', // Slightly rounded corners for modern look
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  textAlign: 'center',
  minHeight: '150px', // Uniform height for each step
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const HowItWorksSection = () => {
  return (
    <Box 
      sx={{ 
        mt: 12, 
        px: 3, 
        py: 8, 
        maxWidth: '1200px', 
        mx: 'auto' 
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center', 
          mb: 6, 
          fontWeight: 'bold', 
          color: theme.palette.text.primary, 
          fontSize: '2.5rem' // Larger title size for emphasis on landing page
        }}
      >
        How It Works
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={stepCardStyles}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary, 
                  fontSize: '1.5rem', 
                  mb: 2 // Space below title for balance
                }}
              >
                {step.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontSize: '1.1rem' // Slightly larger description for readability
                }}
              >
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorksSection;
