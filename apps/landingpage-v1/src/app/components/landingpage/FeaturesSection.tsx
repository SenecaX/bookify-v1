import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { theme } from '@bookify-v1/shared';

const features = [
  { title: '24/7 Availability', description: 'Allow clients to book services anytime.' },
  { title: 'Easy Management', description: 'Manage your services and providers effortlessly.' },
  { title: 'Customizable', description: 'Tailor the booking system to fit your needs.' },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ mt: 12, px: 3, py: 6, backgroundColor: theme.palette.background.default }}> {/* Added more top and bottom padding */}
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center', 
          mb: 6, 
          fontWeight: 'bold', 
          color: theme.palette.text.primary,
          fontSize: '2.5rem' // Larger font size for landing page emphasis
        }}
      >
        Key Features
      </Typography>
      <Grid container spacing={6} justifyContent="center"> {/* Increase spacing and center align */}
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                backgroundColor: theme.palette.background.paper, 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                borderRadius: '12px', // Slightly more rounded corners for a modern look
                maxWidth: '350px', // Limit max width for each feature box
                mx: 'auto' // Center the box horizontally
              }}
            >
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 50, 
                  color: theme.palette.primary.main, 
                  mb: 3 // More space below the icon
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary,
                  mb: 2, // Space below the title for visual balance
                  fontSize: '1.5rem' // Larger font size for better readability
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontSize: '1.1rem' // Slightly larger for landing page readability
                }}
              >
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
