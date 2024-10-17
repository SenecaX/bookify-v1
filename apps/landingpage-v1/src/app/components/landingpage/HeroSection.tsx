import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { theme } from '@bookify-v1/shared';

const boxStyles = {
  textAlign: 'center',
  mt: { xs: 5, md: 10 }, // Set margin top to 5 for mobile and 10 for larger screens
  px: 2,
  maxWidth: '1100px', // Wider container for larger screens
  mx: 'auto', // Center the box horizontally
  py: 10, // Add padding top and bottom for vertical breathing room
};

const titleStyles = {
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  mb: 6,
  fontSize: {
    xs: '2rem', // Font size for extra small screens
    sm: '3rem',   // Font size for small screens
    md: '3.5rem',  // Font size for medium screens and up
  },
};

const subtitleStyles = {
  color: theme.palette.primary.main,
  mb: 4, // Increased margin for better spacing
  fontSize: '2rem', // Larger font size for subtitle
};

const descriptionStyles = {
  color: theme.palette.text.secondary,
  fontSize: '1.25rem', // Slightly larger font size for readability
  maxWidth: 700, // Increase max width for larger screens
  mx: 'auto',
  mb: 6, // More margin for spacing below description
};

const buttonStyles = {
  backgroundColor: theme.palette.secondary.main, // Solid color
  color: theme.palette.secondary.contrastText, // Text color based on contrast
  px: 6, // Increased padding inside the button
  py: 3, // Increased padding inside the button
  borderRadius: '8px', // Slightly more rounded for a modern look
  fontSize: '1.2rem', // Larger button text for emphasis
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Slightly stronger shadow for depth
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark, // Darken button on hover
  },
  mb: 6, // Add margin below button for spacing
};

const HeroSection = () => {
  return (
    <Box sx={boxStyles}>
      <Typography variant="h2" sx={titleStyles}>
        Welcome to Bookify
      </Typography>
      <Typography variant="h5" sx={subtitleStyles}>
        Your Online Booking System
      </Typography>
      <Typography variant="subtitle1" sx={descriptionStyles}>
        Simplify your booking process and manage your services effortlessly.
      </Typography>
      <Button variant="contained" sx={buttonStyles}>
        Get Started
      </Button>
    </Box>
  );
};

export default HeroSection;
