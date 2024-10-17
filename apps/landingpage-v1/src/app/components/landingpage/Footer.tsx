import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 8, py: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Bookify. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="#" color="inherit">Privacy Policy</Link> | <Link href="#" color="inherit">Terms of Service</Link>
      </Typography>
    </Box>
  );
};

export default Footer;