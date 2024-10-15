import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <TextField
      {...register(name, rules)}
      {...rest}
      label={label}
      error={!!errors[name]}
      helperText={(errors[name]?.message as string) || ''}
      fullWidth
      sx={{ mb: 4 }}
    />
  );
};
