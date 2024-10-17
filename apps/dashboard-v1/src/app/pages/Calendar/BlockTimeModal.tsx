// BlockTimeModal.tsx
import React, { useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import ControlledTimeField from './ControlledTimeField';
import { ControlledFormInput } from '@bookify-v1/shared-components';
import moment from 'moment';
import { IBlockedTime } from '../../types';

interface BlockTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: { start: Date; end: Date } | null;
  onSubmit: (data: {
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
  selectedBlockedTime: IBlockedTime | null;
  onCancelBlockedTime: (blockedTime: IBlockedTime) => void;
}

interface BlockTimeFormValues {
  startTime: string;
  endTime: string;
  reason: string;
}

const BlockTimeModal: React.FC<BlockTimeModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  onSubmit,
  selectedBlockedTime,
  onCancelBlockedTime,
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
    if (selectedBlockedTime) {
      console.log('selectedBlockedTime', selectedBlockedTime);
    }
  }, [selectedBlockedTime]);
  

  useEffect(() => {
    if (isOpen) {
      console.log('useEffect triggered with isOpen:', isOpen);
      console.log('selectedBlockedTime:', selectedBlockedTime);
      console.log('timeRange:', timeRange);
      
      if (selectedBlockedTime) {
        console.log('Resetting form for selectedBlockedTime');
        const formattedStartTime = moment(selectedBlockedTime.startTime).format('HH:mm');
        const formattedEndTime = moment(selectedBlockedTime.endTime).format('HH:mm');
        
        reset({
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          reason: selectedBlockedTime.reason || '',
        });
      } else if (timeRange) {
        console.log('Resetting form for new timeRange');
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
    }
  }, [isOpen, timeRange, selectedBlockedTime, reset]);
  

  const handleSubmit = (data: BlockTimeFormValues) => {
    if (!timeRange) return;

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

  if (!isOpen || !timeRange) return null;

  return (
    <div>
      <h3>Block Time</h3>
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

          {/* Render Cancel Appointment button if editing an existing appointment */}
          {selectedBlockedTime && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onCancelBlockedTime(selectedBlockedTime)}
              style={{ marginLeft: '10px' }} // Optional styling
            >
              Cancel Appointment
            </Button>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default BlockTimeModal;
