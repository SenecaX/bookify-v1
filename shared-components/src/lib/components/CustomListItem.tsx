import React from 'react';
import { ListItem, ListItemText, Divider } from '@mui/material';
import CustomAvatar from './CustomAvatar';

interface CustomListItemProps {
    name: string;
    text: string;
    onClick: () => void; 
}

export const CustomListItem: React.FC<CustomListItemProps> = ({ name, text, onClick }) => {
    return (
        <>
            <ListItem onClick={onClick} sx={{ cursor: 'pointer' }}>
                <CustomAvatar name={name} />
                <ListItemText primary={text} sx={{ ml: 2 }} /> 
            </ListItem>
            <Divider />
        </>
    );
};
