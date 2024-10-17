import React from 'react';
import { TextField } from '@mui/material';

interface TimeFieldProps {
  label: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const TimeField = ({ label, name, value, onChange, error, helperText }: TimeFieldProps) => {
  return (
    <TextField
      label={label}
      type="time"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
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
  );
};

export default TimeField;
