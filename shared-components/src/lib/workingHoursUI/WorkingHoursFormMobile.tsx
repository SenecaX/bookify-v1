import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import { DaySchedule, FormSwitch, FormTimePicker } from '@bookify-v1/shared-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import get from 'lodash.get';
import moment from 'moment';

interface WorkingHoursFormMobileProps {
  schedules: DaySchedule[];
  onSubmit: () => void;
}

export const WorkingHoursFormMobile: React.FC<WorkingHoursFormMobileProps> = ({
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
        '& .MuiAccordion-root': {
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        },
        '& .MuiGrid-item': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    >
      {schedules.map((schedule, index) => {
        const breakFields = useFieldArray({
          control,
          name: `schedules.${index}.breaks`,
        });

        const isActive = watch(`schedules.${index}.isActive`);

        // Validation functions for working hours
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
          <Accordion key={schedule.day}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`schedule-content-${index}`}
              id={`schedule-header-${index}`}
              sx={{
                backgroundColor: isActive
                  ? theme.palette.primary.light
                  : theme.palette.background.default,
              }}
            >
              <Typography variant="subtitle1">{schedule.day}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormSwitch
                    name={`schedules.${index}.isActive`}
                    label="Activate Schedule"
                    rules={{}}
                  />
                </Grid>
                {isActive && (
                  <>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                      <IconButton
                        onClick={() =>
                          breakFields.append({ startTime: '', endTime: '' })
                        }
                        sx={{
                          color: theme.palette.primary.main,
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: theme.shadows[2],
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                          },
                          mb: 1,
                        }}
                        aria-label="Add Break"
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    {breakFields.fields.map((breakField, breakIndex) => {
                      // Validation functions for breaks
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
                        <Box key={breakField.id} sx={{ width: '100%', mb: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={5}>
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
                            <Grid item xs={5}>
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
                            <Grid item xs={2}>
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
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default WorkingHoursFormMobile;
