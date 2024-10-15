// WorkingHoursForm.tsx
import { FormSwitch, FormTimePicker } from '@bookify/shared-components';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material';
import get from 'lodash.get';
import moment, { Moment } from 'moment';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface DaySchedule {
  day: string;
  isActive: boolean;
  workingHours: {
    startTime: Moment | null;
    endTime: Moment | null;
  };
  breaks: {
    startTime: Moment | null;
    endTime: Moment | null;
  }[];
}

interface WorkingHoursFormProps {
  schedules: DaySchedule[];
  onSubmit: () => void;
}

export const WorkingHoursForm: React.FC<WorkingHoursFormProps> = ({
  schedules,
  onSubmit,
}) => {
  const theme = useTheme();
  const { control, formState, getValues, watch } = useFormContext();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        mt: 4,
        mb: 4,
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 4 },
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05)`,
      }}
    >
      {schedules.map((schedule, index) => {
        const breakFields = useFieldArray({
          control,
          name: `schedules.${index}.breaks`,
        });

        const isActive = watch(`schedules.${index}.isActive`);

        // Validation functions
        const validateStartTime = (value: string) => {
          const endTime = getValues(`schedules.${index}.workingHours.endTime`);
          if (
            value &&
            endTime &&
            moment(value, 'HH:mm').isSameOrAfter(moment(endTime, 'HH:mm'))
          ) {
            return 'Start time must be before end time';
          }
          return true;
        };

        const validateEndTime = (value: string) => {
          const startTime = getValues(
            `schedules.${index}.workingHours.startTime`
          );
          if (
            value &&
            startTime &&
            moment(value, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))
          ) {
            return 'End time must be after start time';
          }
          return true;
        };

        return (
          <Box
            key={schedule.day}
            sx={{
              mb: 4,
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              boxShadow: `0 2px 8px rgba(0, 0, 0, 0.03)`,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2}>
                <FormSwitch
                  name={`schedules.${index}.isActive`}
                  label={schedule.day}
                  rules={{}}
                  sx={{ mb: { xs: 2, sm: 0 } }}
                />
              </Grid>
              {isActive ? (
                <>
                  <Grid item xs={12} sm={3}>
                    <FormTimePicker
                      name={`schedules.${index}.workingHours.startTime`}
                      label="Start Time"
                      rules={{
                        required: 'Start time is required',
                        validate: validateStartTime,
                      }}
                      error={
                        !!get(
                          formState.errors,
                          `schedules.${index}.workingHours.startTime`
                        )
                      }
                      helperText={
                        get(
                          formState.errors,
                          `schedules.${index}.workingHours.startTime.message`
                        ) as string | undefined
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormTimePicker
                      name={`schedules.${index}.workingHours.endTime`}
                      label="End Time"
                      rules={{
                        required: 'End time is required',
                        validate: validateEndTime,
                      }}
                      error={
                        !!get(
                          formState.errors,
                          `schedules.${index}.workingHours.endTime`
                        )
                      }
                      helperText={
                        get(
                          formState.errors,
                          `schedules.${index}.workingHours.endTime.message`
                        ) as string | undefined
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton
                      onClick={() =>
                        breakFields.append({ startTime: '', endTime: '' })
                      }
                      sx={{
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1)`,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light,
                        },
                      }}
                      aria-label="Add Break"
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Off
                  </Typography>
                </Grid>
              )}
            </Grid>

            {isActive &&
              breakFields.fields.map((breakField, breakIndex) => {
                const validateBreakStartTime = (value: string) => {
                  const breakEnd = getValues(
                    `schedules.${index}.breaks.${breakIndex}.endTime`
                  );
                  if (
                    value &&
                    breakEnd &&
                    moment(value, 'HH:mm').isSameOrAfter(
                      moment(breakEnd, 'HH:mm')
                    )
                  ) {
                    return 'Break start time must be before break end time';
                  }
                  return true;
                };

                const validateBreakEndTime = (value: string) => {
                  const breakStart = getValues(
                    `schedules.${index}.breaks.${breakIndex}.startTime`
                  );
                  if (
                    value &&
                    breakStart &&
                    moment(value, 'HH:mm').isSameOrBefore(
                      moment(breakStart, 'HH:mm')
                    )
                  ) {
                    return 'Break end time must be after break start time';
                  }
                  return true;
                };

                return (
                  <Box key={breakField.id} sx={{ mt: 3, pl: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <FormTimePicker
                          name={`schedules.${index}.breaks.${breakIndex}.startTime`}
                          label="Break Start"
                          rules={{
                            required: 'Break start time is required',
                            validate: validateBreakStartTime,
                          }}
                          error={
                            !!get(
                              formState.errors,
                              `schedules.${index}.breaks.${breakIndex}.startTime`
                            )
                          }
                          helperText={
                            get(
                              formState.errors,
                              `schedules.${index}.breaks.${breakIndex}.startTime.message`
                            ) as string | undefined
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormTimePicker
                          name={`schedules.${index}.breaks.${breakIndex}.endTime`}
                          label="Break End"
                          rules={{
                            required: 'Break end time is required',
                            validate: validateBreakEndTime,
                          }}
                          error={
                            !!get(
                              formState.errors,
                              `schedules.${index}.breaks.${breakIndex}.endTime`
                            )
                          }
                          helperText={
                            get(
                              formState.errors,
                              `schedules.${index}.breaks.${breakIndex}.endTime.message`
                            ) as string | undefined
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <IconButton
                          onClick={() => breakFields.remove(breakIndex)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: theme.palette.error.light,
                            },
                          }}
                          aria-label="Delete Break"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
          </Box>
        );
      })}
    </Box>
  );
};

export default WorkingHoursForm;
