import React, { useEffect } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { ControlledFormInput } from '@bookify-v1/shared-components';
import moment from 'moment';
import { IBlockedTime } from '../../../types';

interface EditBlockedTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedTime: IBlockedTime;
  onSubmit: (data: {
    _id: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
  onCancel: () => void;
}

const EditBlockedTimeModal: React.FC<EditBlockedTimeModalProps> = ({
  isOpen,
  onClose,
  blockedTime,
  onSubmit,
  onCancel,
}) => {
  const methods = useForm<any>({
    defaultValues: {
      startTime: '',
      endTime: '',
      reason: '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (isOpen && blockedTime) {
      reset({
        startTime: moment(blockedTime.startTime).format('HH:mm'),
        endTime: moment(blockedTime.endTime).format('HH:mm'),
        reason: blockedTime.reason || '',
      });
    }
  }, [isOpen, blockedTime, reset]);

  const handleSubmit = (data: any) => {
    const selectedDate = moment(blockedTime.startTime).format('YYYY-MM-DD');

    const startTimeISO = moment(
      `${selectedDate} ${data.startTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();
    const endTimeISO = moment(
      `${selectedDate} ${data.endTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();

    if(!blockedTime._id) return;

    // Submit updated blocked time data
    onSubmit({
      _id: blockedTime._id,
      startTime: startTimeISO,
      endTime: endTimeISO,
      reason: data.reason,
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box  sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', margin: '100px auto' }}>
        <h3>Blocked Time Details</h3>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <ControlledFormInput
              name="startTime"
              label="Start Time"
              rules={{ required: 'Start time is required' }}
              disabled={true}
            />
            <ControlledFormInput
              name="endTime"
              label="End Time"
              rules={{ required: 'End time is required' }}
              disabled={true}

            />
            <ControlledFormInput
              name="reason"
              label="Reason for Blocking Time"
              rules={{ required: 'Reason is required' }}
              disabled={true}
            />
            <Button
              onClick={onCancel}
              variant="contained"
              color="secondary"
              style={{ marginLeft: '10px' }}
            >
              Cancel Blocked Time
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default EditBlockedTimeModal;
