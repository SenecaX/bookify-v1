import React from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext, Controller } from 'react-hook-form';
import TimeField from './TimeField';

interface DayRowProps {
  dayIndex: number;
  breakIndex: number;
  remove: (index: number) => void;
}

const DayRow = ({ dayIndex, breakIndex, remove }: DayRowProps) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {/* Empty space for offset on desktop */}
      <Grid item xs={false} sm={4} />

      {/* Main content: Two TimeFields and the Delete button */}
      <Grid item xs={12} sm={6} md={6}>
        <Box
          p={2}
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid container spacing={2}>
            {/* Break Start Time */}
            <Grid item xs={10} sm={5}>
              <Controller
                name={`workingHours.${dayIndex}.breaks.${breakIndex}.start`}
                control={control}
                render={({ field }) => (
                  <TimeField
                    label="Break Start"
                    {...field}
                    error={!!(errors.workingHours as any)?.[dayIndex]?.breaks?.[breakIndex]?.start}
                    helperText={(errors.workingHours as any)?.[dayIndex]?.breaks?.[breakIndex]?.start?.message}
                  />
                )}
              />
            </Grid>

            {/* Break End Time */}
            <Grid item xs={10} sm={5}>
              <Controller
                name={`workingHours.${dayIndex}.breaks.${breakIndex}.end`}
                control={control}
                render={({ field }) => (
                  <TimeField
                    label="Break End"
                    {...field}
                    error={!!(errors.workingHours as any)?.[dayIndex]?.breaks?.[breakIndex]?.end}
                    helperText={(errors.workingHours as any)?.[dayIndex]?.breaks?.[breakIndex]?.end?.message}
                  />
                )}
              />
            </Grid>

            {/* Delete Icon */}
            <Grid item xs={2} sm={2} display="flex" justifyContent="flex-end">
              <IconButton edge="end" onClick={() => remove(breakIndex)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DayRow;
