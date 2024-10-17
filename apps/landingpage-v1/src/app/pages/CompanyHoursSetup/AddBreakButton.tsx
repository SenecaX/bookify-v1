import { Button } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const AddBreakButton = ({ handleAddBreak }: { handleAddBreak: () => void }) => {
    return (
        <Button 
            onClick={handleAddBreak} 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', padding: 0, fontSize: 14, fontWeight: 200 }}
        >
            Add Break
        </Button>
    );
};

export default AddBreakButton;
