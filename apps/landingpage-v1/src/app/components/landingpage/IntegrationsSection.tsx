import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { theme } from '@bookify-v1/shared';

const integrations = [
  'Google Calendar Sync',
  'Google Single Sign-On',
  'AI Powered bookings',
];

// Extract styles for the integration cards
const integrationCardStyles = {
  p: 3, // Padding inside the card for space around text
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px', // Rounded corners for modern look
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  textAlign: 'center',
  minHeight: '100px', // Ensure uniform height for cards
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const IntegrationsSection = () => {
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
        Integrations
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {integrations.map((integration, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={integrationCardStyles}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary, 
                  fontSize: '1.5rem' // Larger text for better readability
                }}
              >
                {integration}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IntegrationsSection;
