import React from 'react';
import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FormSwitchProps extends Omit<SwitchProps, 'name'> {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  rules,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const error = !!errors[name];
  const helperText = errors[name]?.message as string;

  const { ref, ...registerProps } = register(name, rules);

  const value = watch(name); // Get the current value of the switch

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            {...rest}
            {...registerProps}
            inputRef={ref}
            checked={!!value} // Ensure value is boolean
            onChange={(event, checked) => {
              setValue(name, checked, { shouldValidate: true });
              if (registerProps.onChange) {
                registerProps.onChange(event);
              }
              if (rest.onChange) {
                rest.onChange(event, checked);
              }
            }}
            color={error ? 'error' : 'primary'}
          />
        }
        label={label}
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </>
  );
};
