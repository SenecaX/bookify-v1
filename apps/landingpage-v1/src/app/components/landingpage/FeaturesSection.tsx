import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { theme } from '@bookify-v1/shared';

const features = [
  { title: '24/7 Availability', description: 'Let your clients book appointments anytime, anywhere, 24/7.' },
  { title: 'Effortless Management', description: 'Easily manage your services, providers, and appointments in one place.' },
  { title: 'Fully Customizable', description: 'Tailor the system to meet your business needs, no matter your industry.' },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ mt: 12, px: { xs: 2, sm: 4 }, py: 8 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center', 
          mb: 8, 
          fontWeight: 'bold', 
          color: theme.palette.text.primary,
          fontSize: { xs: '2rem', sm: '2.5rem' }, // Responsive font sizing
        }}
      >
        Key Features
      </Typography>
      <Grid container spacing={6} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                backgroundColor: theme.palette.background.paper, 
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Slightly stronger shadow for more depth
                borderRadius: '16px', // More rounded corners for a modern aesthetic
                maxWidth: '360px', // Increased max-width for better layout on larger screens
                mx: 'auto', // Center each feature box horizontally
                transition: 'transform 0.3s ease', // Smooth hover effect
                '&:hover': {
                  transform: 'translateY(-5px)', // Hover effect for interactivity
                }
              }}
            >
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 60, // Larger icon for emphasis
                  color: theme.palette.primary.main, 
                  mb: 3 
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary,
                  mb: 2,
                  fontSize: '1.6rem', // Slightly larger for feature titles
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontSize: '1.15rem', // Increase body text size for readability
                  lineHeight: '1.6' // Improve readability with better line height
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
