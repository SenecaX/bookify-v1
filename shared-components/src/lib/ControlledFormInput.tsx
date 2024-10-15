import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  rules?: object;  
  disabled?: boolean;
}

export const ControlledFormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules,
  disabled = false,
  ...rest
}) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          disabled={disabled}
          error={!!errors[name]}
          helperText={errors[name] ? (errors[name]?.message as string) : ''}
          fullWidth
          sx={{ mb: 2 }}
        />
      )}
    />
  );
};
