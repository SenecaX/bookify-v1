import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment, { Moment } from 'moment';
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

interface FormTimePickerProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
  error?: boolean;
  helperText?: string;
}

export const FormTimePicker: React.FC<FormTimePickerProps> = ({
  name,
  label,
  rules,
  error,
  helperText,
}) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <TimePicker
            label={label}
            value={field.value ? moment(field.value, 'HH:mm') : null}
            onChange={(newValue: Moment | null) =>
              field.onChange(newValue ? newValue.format('HH:mm') : '')
            }
            slotProps={{
              textField: {
                error: error,
                helperText: helperText,
                fullWidth: true,
                sx: {
                  mb: 4,
                  '& .MuiInputBase-root': { height: '40px' },
                  '& .MuiInputBase-input': { fontSize: '0.875rem' },
                },
                inputProps: { 'aria-label': label },
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
