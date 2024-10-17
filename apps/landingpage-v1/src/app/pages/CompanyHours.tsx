import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import WorkingHoursManager from '../components/workinghours/WorkingHoursManager';

const HomeHours: React.FC = () => {
  const [companyId] = useState<string>('company-123'); // Example company ID
  const [saveWorkingHours, setSaveWorkingHours] = useState<(() => Promise<void>) | null>(null);

  const handleSave = () => {
    // Save logic here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full height of the viewport for vertical centering
        width: '100%',      // Ensure full width for centering
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',      // Ensure full width
          maxWidth: '900px',   // Constrain max width of the content
          margin: '0 auto',    // Center content horizontally
          textAlign: 'center', // Optional: center text inside the container
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Company Setup
        </Typography>

        <WorkingHoursManager
          companyId={companyId}
          onSave={(saveFn) => setSaveWorkingHours(() => saveFn)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save Working Hours
        </Button>
      </Box>
    </Box>
  );
};

export default HomeHours;
