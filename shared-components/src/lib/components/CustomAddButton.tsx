import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CustomAddButtonProps {
  onClick: () => void;
}

export const CustomAddButton: React.FC<CustomAddButtonProps> = ({
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        marginBottom: theme.spacing(2),
      }}
      onClick={onClick}
    >
      Add
    </Button>
  );
};
