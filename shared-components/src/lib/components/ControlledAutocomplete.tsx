import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomAutocomplete } from './Autocomplete';
import { AutocompleteRenderOptionState } from '@mui/material';

interface HasId {
  _id?: string; // All objects passed to this component must have an _id field
}

interface ControlledAutocompleteProps<T extends HasId> {
  name: string;
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => React.ReactNode;
  rules?: object;
  placeholder?: string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  disabled?: boolean;
}

export const ControlledAutocomplete = <T extends HasId>({
  name,
  label,
  options,
  getOptionLabel,
  rules,
  placeholder,
  renderOption,
  isOptionEqualToValue,
  disabled,
  ...props
}: ControlledAutocompleteProps<T>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => {
        // Ensure value is a string (ID) and find the matching option
        const selectedValue = options.find(option => option._id === value) || null;

        return (
          <CustomAutocomplete
            label={label}
            options={options}
            getOptionLabel={getOptionLabel}
            value={selectedValue} // Pass the matching object to the Autocomplete
            renderOption={renderOption}
            placeholder={placeholder}
            isOptionEqualToValue={(option, value) => option._id === value._id} // Ensure comparison between string _id and value
            disabled={disabled}
            onChange={(event, newValue) => {
              // When selecting a new option, store only the _id
              onChange(newValue?._id || '');
            }}
            {...props}
          />
        );
      }}
    />
  );
};
