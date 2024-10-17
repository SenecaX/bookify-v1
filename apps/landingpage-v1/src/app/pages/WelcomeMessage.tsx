import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const WelcomeMessage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Instabooking
        </Typography>
        <Typography variant="body1">
          Your personal space is under construction. You will receive an email
          soon with the links.
        </Typography>
      </Box>
    </Container>
  );
};

export default WelcomeMessage;
