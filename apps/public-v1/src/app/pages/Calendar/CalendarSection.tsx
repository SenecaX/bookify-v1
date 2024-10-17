import { Box, Typography } from "@mui/material";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarSectionProps {
    onDateSelect: (date: Date) => void;
  }

  // Initialize Moment.js localizer
const localizer = momentLocalizer(moment);
  
  export const CalendarSection: React.FC<CalendarSectionProps> = ({ onDateSelect }) => (
    <Box boxShadow={3} p={2} borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Select a Date
      </Typography>
      <Calendar
        localizer={localizer}
        events={[]}
        selectable
        defaultView="month"
        onSelectSlot={(slotInfo) => onDateSelect(slotInfo.start)}
        style={{ height: 400 }}
        views={['month']}
        dayPropGetter={(date) => {
          const day = moment(date).day();
          return day === 6 || day === 0
            ? {
                style: { backgroundColor: '#f0f0f0', color: '#ccc', pointerEvents: 'none' },
              }
            : {};
        }}
      />
    </Box>
  );
  