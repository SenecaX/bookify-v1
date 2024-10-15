import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface FormButtonProps
  extends Omit<ButtonProps, 'variant' | 'fullWidth' | 'type'> {
  loading: boolean;
  isEditable?: boolean; // Added prop to control edit state
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  loading,
  isEditable,
  ...rest
}) => (
  <Button
    variant="contained"
    fullWidth
    type="submit"
    disabled={loading || !isEditable} // Disable if loading or not editable
    sx={{ mt: 3, mb: 2, py: 1.5 }}
    {...rest}
  >
    {loading ? 'Submitting...' : children}
  </Button>
);
