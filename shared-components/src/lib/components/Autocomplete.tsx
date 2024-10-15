import React from 'react';
import { Autocomplete, AutocompleteRenderOptionState, TextField } from '@mui/material';

interface AutocompleteProps<T> {
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  value: T | null;
  onChange: (event: React.SyntheticEvent, value: T | null) => void;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => React.ReactNode;
  placeholder?: string;
  isOptionEqualToValue?: (option: T, value: T) => boolean; 
  disabled?: boolean;
}

export const CustomAutocomplete = <T,>({
  label,
  options,
  getOptionLabel,
  value,
  onChange,
  renderOption,
  placeholder,
  isOptionEqualToValue, 
  disabled = false, 
}: AutocompleteProps<T>) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      value={value}  // Full object passed here
      onChange={onChange}  // Handle selection change
      renderOption={renderOption}
      isOptionEqualToValue={isOptionEqualToValue}  // Compare by ID
      disabled={disabled}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={label} 
          variant="outlined" 
          placeholder={placeholder}
        />
      )}
      fullWidth
    />
  );
};