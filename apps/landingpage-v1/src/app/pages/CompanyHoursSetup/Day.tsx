import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import DayToggle from './DayToggle';
import AddBreakButton from './AddBreakButton';
import DayRow from './DayRow';
import TimeField from './TimeField';

interface DayProps {
  index: number;
}

const Day = ({ index }: DayProps) => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const day = watch(`workingHours.${index}`);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workingHours.${index}.breaks`,
  });

  const handleToggleChange = (value: boolean) => {
    setValue(`workingHours.${index}.isDayOn`, value);
    if (!value) {
      // Reset start and end times when day is toggled off
      setValue(`workingHours.${index}.start`, '');
      setValue(`workingHours.${index}.end`, '');
      // Optionally, remove all breaks
      remove();
    }
  };

  const handleAddBreak = () => {
    if (fields.length < 3) {
      append({ start: '', end: '' });
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {/* Column 1 with Switch */}
        <Grid item xs={3} sm={2}>
          <Box p={2}>
            <DayToggle
              isDayOn={day.isDayOn}
              handleSwitchChange={(e) => handleToggleChange(e.target.checked)}
            />
          </Box>
        </Grid>

        {/* Column 2 with Day Label */}
        <Grid item xs={4} sm={2}>
          <Box p={2}>
            <Typography variant="h6">{day.day || "No label provided"}</Typography>
          </Box>
        </Grid>

        {day.isDayOn ? (
          <>
            {/* Column 3 with Add Break Button */}
            <Grid item xs={4} sm={2} order={{ xs: 2, sm: 4 }}>
              <Box p={2}>
                <AddBreakButton handleAddBreak={handleAddBreak} />
              </Box>
            </Grid>

            {/* Column 4 with TimeFields */}
            <Grid item xs={12} sm={6} order={{ xs: 3, sm: 3 }}>
              <Box p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workingHours.${index}.start`}
                      control={control}
                      render={({ field }) => (
                        <TimeField
                          label="Start Time"
                          {...field}
                          error={!!(errors.workingHours as any)?.[index]?.start}
                          helperText={(errors.workingHours as any)?.[index]?.start?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workingHours.${index}.end`}
                      control={control}
                      render={({ field }) => (
                        <TimeField
                          label="End Time"
                          {...field}
                          error={!!(errors.workingHours as any)?.[index]?.end}
                          helperText={(errors.workingHours as any)?.[index]?.end?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        ) : (
          <Grid item xs={12} sm={8}>
            <Box p={2} textAlign="center">
              <Typography variant="h6">Day OFF</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Render dynamically added breaks */}
      {day.isDayOn && fields.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {fields.map((field, breakIndex) => (
            <DayRow
              key={field.id}
              dayIndex={index}
              breakIndex={breakIndex}
              remove={remove}
            />
          ))}
        </Grid>
      )}
    </>
  );
};

export default Day;
