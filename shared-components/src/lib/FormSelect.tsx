import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form'; // Import FieldError type

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <TextField
      select
      label={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name] ? (errors[name] as FieldError).message : ''} // Ensure helperText is a string
      fullWidth
      sx={{ mb: 3 }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
