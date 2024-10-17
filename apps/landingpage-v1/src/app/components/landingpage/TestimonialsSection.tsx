import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { theme } from '@bookify-v1/shared';

const testimonials = [
  { name: 'John Doe', feedback: 'Bookify has transformed how I manage my appointments!' },
  { name: 'Jane Smith', feedback: 'A fantastic tool for my business. Highly recommend!' },
];

// Extract styles to maintain consistency and cleanliness
const testimonialCardStyles = {
  p: 4, // Increase padding for better spacing
  backgroundColor: theme.palette.background.paper, // Ensure consistency with the theme
  borderRadius: '12px', // Rounded corners for modern flat design
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth without overdoing it
  textAlign: 'center', // Center-align the text
  minHeight: '200px', // Ensure uniform height for cards
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const TestimonialsSection = () => {
  return (
    <Box 
      sx={{ 
        mt: 12, 
        px: 3, 
        py: 8, 
        backgroundColor: theme.palette.background.default, 
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
          fontSize: '2.5rem' // Larger size for section title
        }}
      >
        What Our Clients Say
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={testimonialCardStyles}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontStyle: 'italic', 
                  fontSize: '1.1rem', // Slightly larger font for readability
                  color: theme.palette.text.secondary 
                }}
              >
                "{testimonial.feedback}"
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 3, // Increase margin for separation
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary 
                }}
              >
                - {testimonial.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestimonialsSection;
