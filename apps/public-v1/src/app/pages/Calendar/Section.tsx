import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionProps {
  title: string;
  content: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <Box p={2} boxShadow={3} borderRadius={2}>
    <Typography variant="h6" component="p">{title}:</Typography>
    <Typography variant="body1">{content}</Typography>
  </Box>
);

export default Section;
