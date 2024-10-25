import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { theme } from '@bookify-v1/shared';

const industries = [
  'Health & Wellness',
  'Beauty & Spa',
  'Education',
  'Fitness',
  'Consulting',
];

// Extract styles for the Industry Cards
const industryCardStyles = {
  p: 4, // Padding inside the card for better spacing
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px', // Larger border radius for a modern look
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Slightly stronger shadow for better depth
  textAlign: 'center', // Center the text
  minHeight: '150px', // Ensure consistent height across cards
  display: 'flex', // Flexbox to align content
  flexDirection: 'column', // Stack content vertically
  justifyContent: 'center', // Vertically center content
};

const titleStyles = {
  textAlign: 'center',
  mb: 6,
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  fontSize: '2.5rem', // Larger font size for section title
};

const IndustriesSection = () => {
  return (
    <Box sx={{ mt: 12, px: 3, py: 6, mx: 'auto' }}>
      <Typography variant="h3" sx={titleStyles}>
        Industries We Serve
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {industries.map((industry, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Paper sx={industryCardStyles}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, fontSize: '1.5rem' }}>
                {industry}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IndustriesSection;
