import React from 'react';
import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface ControlledTimeFieldProps {
  label: string;
  name: string; // name is required for react-hook-form
  error?: boolean;
  helperText?: string;
  disabled?: boolean; // Optional prop to disable the input field
}

const ControlledTimeField: React.FC<ControlledTimeFieldProps> = ({ label, name, error, helperText, disabled = false }) => {
  const { control } = useFormContext(); // Get control from react-hook-form context

  return (
    <Controller
      name={name}
      control={control}
      defaultValue="" // set default value
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type="time"
          error={error}
          helperText={helperText}
          disabled={disabled}
          InputProps={{
            sx: {
              height: 30,
              padding: '0 8px',
              step: 300, // 5 minutes
            },
          }}
          sx={{
            minWidth: 100,
            marginBottom: 2,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      )}
    />
  );
};

export default ControlledTimeField;
