import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

interface DayToggleProps {
  isDayOn: boolean;
  handleSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DayToggle = ({ isDayOn, handleSwitchChange }: DayToggleProps) => {
  return (
    <FormControlLabel
      control={<Switch checked={isDayOn} onChange={handleSwitchChange} />}
      label={isDayOn ? "On" : "Off"}
    />
  );
};

export default DayToggle;
