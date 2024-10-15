import React from 'react';
import { Avatar } from '@mui/material'; 

interface CustomAvatarProps {
    name: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ name }) => {
    const firstLetter = name.charAt(0).toUpperCase();

    return (
        <Avatar>{firstLetter}</Avatar>
    );
};

export default CustomAvatar;