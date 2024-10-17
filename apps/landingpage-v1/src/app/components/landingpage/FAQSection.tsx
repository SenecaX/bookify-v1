import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const faqs = [
  { question: 'How does Bookify work?', answer: 'Bookify allows you to manage your bookings online.' },
  { question: 'Is there a free trial?', answer: 'Yes, you can try Bookify for free for 14 days.' },
];

const FAQSection = () => {
  const theme = useTheme(); // Access the theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive handling for smaller screens

  return (
    <Box
      sx={{
        mt: 12, 
        px: 3, 
        py: 8, 
        backgroundColor: theme.palette.background.default, 
        mx: 'auto', // Center content horizontally
      }}
    >
      <Typography
        variant="h3" // Larger heading for landing page prominence
        sx={{
          textAlign: 'center',
          mb: 6, // Increased margin for better spacing
          color: theme.palette.text.primary, // Use theme's primary text color
          fontWeight: 'bold', // Make the FAQ title bold for emphasis
          fontSize: '2.5rem', // Adjust font size for better emphasis
        }}
      >
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion 
          key={index} 
          sx={{ 
            mb: 3, // Increased margin between accordion items for better spacing
            borderRadius: '8px', // Rounded corners for modern look
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
            overflow: 'hidden', // Ensure consistent rounded corners
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
            sx={{
              backgroundColor: theme.palette.background.paper, // Consistent background color
              py: 2, // Increased padding for better readability
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary, 
                fontSize: '1.25rem', // Adjusted font size for readability
              }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: theme.palette.background.default, 
              borderTop: `1px solid ${theme.palette.divider}`, // Subtle divider for separation
              py: 2, // Padding for accordion details content
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary, 
                fontSize: '1.1rem', // Slightly larger text for readability
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQSection;
