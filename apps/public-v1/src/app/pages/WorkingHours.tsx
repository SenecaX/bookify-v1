import React from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const workingHoursData = [
  { day: 'Monday', hours: '08:00 AM - 05:00 PM' },
  { day: 'Tuesday', hours: '09:00 AM - 06:00 PM' },
  { day: 'Wednesday', hours: '08:00 AM - 05:00 PM' },
  { day: 'Thursday', hours: '08:00 AM - 05:00 PM' },
  { day: 'Friday', hours: '08:00 AM - 05:00 PM' },
  { day: 'Saturday', hours: 'Closed' },
  { day: 'Sunday', hours: 'Closed' },
];

const WorkingHours: React.FC = () => {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Working Hours
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)' }}>
        <Table aria-label="working hours table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workingHoursData.map((dayInfo) => (
              <TableRow key={dayInfo.day}>
                <TableCell component="th" scope="row">
                  {dayInfo.day}
                </TableCell>
                <TableCell>{dayInfo.hours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default WorkingHours;
