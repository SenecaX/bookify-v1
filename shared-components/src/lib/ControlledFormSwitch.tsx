import { FormControlLabel, Switch, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface FormSwitchProps {
  name: string;
  label: string;
  rules?: object;
}

export const ControlledFormSwitch: React.FC<FormSwitchProps> = ({
    name,
    label,
    rules,
  }) => {
    const { control, formState: { errors } } = useFormContext();

    const hasError = !!errors[name];
  
    return (
      <>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  checked={!!field.value} // Ensure value is boolean
                  onChange={(event, checked) => field.onChange(checked)}
                  color={hasError ? 'error' : 'primary'}
                />
              }
              label={label}
            />
          )}
        />
        {hasError && (
          <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
        )}
      </>
    );
  };
