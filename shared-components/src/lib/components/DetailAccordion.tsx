import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DetailAccordionProps {
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
    title: string; 
}

export const DetailAccordion: React.FC<DetailAccordionProps> = ({ isOpen, onClose, children, title }) => {
    return (
        <Accordion expanded={isOpen} onChange={onClose}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};
