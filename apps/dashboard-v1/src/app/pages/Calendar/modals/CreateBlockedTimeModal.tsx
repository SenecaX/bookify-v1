import React, { useEffect } from 'react';
import { Modal, Box, Button, Grid } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { ControlledFormInput } from '@bookify-v1/shared-components';
import moment from 'moment';
import ControlledTimeField from '../ControlledTimeField';

interface CreateBlockedTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: { start: Date; end: Date };
  onSubmit: (data: {
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
}

interface BlockTimeFormValues {
  startTime: string;
  endTime: string;
  reason: string;
}

const CreateBlockedTimeModal: React.FC<CreateBlockedTimeModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  onSubmit,
}) => {
  const methods = useForm<BlockTimeFormValues>({
    defaultValues: {
      startTime: '',
      endTime: '',
      reason: '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (isOpen) {
      
      const formattedStartTime = timeRange.start.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const formattedEndTime = timeRange.end.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      reset({
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        reason: '',
      });
    }
  }, [isOpen, timeRange, reset]);

  const handleSubmit = (data: BlockTimeFormValues) => {
    const selectedDate = moment(timeRange.start).format('YYYY-MM-DD');

    const startTimeISO = moment(
      `${selectedDate} ${data.startTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();
    const endTimeISO = moment(
      `${selectedDate} ${data.endTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();

    onSubmit({
      startTime: startTimeISO,
      endTime: endTimeISO,
      reason: data.reason,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', margin: '100px auto' }}>
        <h3>Create Blocked Time</h3>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={6}>
                <ControlledTimeField label="Start Time" name="startTime" />
              </Grid>
              <Grid item xs={6}>
                <ControlledTimeField label="End Time" name="endTime" />
              </Grid>
            </Grid>
            <ControlledFormInput
              name="reason"
              label="Reason for Blocking Time"
              rules={{ required: 'This field is required' }}
            />
            <Button type="submit" variant="contained" color="primary">
              Block Time
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default CreateBlockedTimeModal;
