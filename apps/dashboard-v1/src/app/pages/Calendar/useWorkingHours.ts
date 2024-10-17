import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { selectCompanyData } from '../../store/company.slice';
import { IBlockedTime } from '../../types';

// Define the return type of the hook
interface WorkingHours {
  getWorkingHoursLimits: (day: Date) => { min: Date; max: Date };
  isOffDayOrHoliday: (date: Date) => boolean;
  getBreakEvents: (
    startOfRange: Date,
    endOfRange: Date,
  ) => { start: Date; end: Date; title: string }[];
  isBreakTime: (date: Date) => boolean;
  hasConflict: (
    start: Date,
    end: Date,
    breakEvents: { start: Date; end: Date }[],
    appointments: { start: Date; end: Date }[],
    blockedTimes: IBlockedTime[],
  ) => boolean;
  getSlotStyle: (
    date: Date,
    isBreakTime: (date: Date) => boolean,
  ) => { style: React.CSSProperties };
}
// Custom hook for managing working hours, breaks, and holidays
const useWorkingHours = (): WorkingHours => {
  // Get the company data from Redux store
  const companyData = useSelector(selectCompanyData);

  // Fallback for working hours and holidays in case they don't exist
  const workingHours = companyData?.workingHours || [];
  const holidays = companyData?.holidays || [];

    // Function to check for conflicts between selected time and existing events
    const hasConflict = (
      start: Date,
      end: Date,
      breakEvents: { start: Date; end: Date }[],
      appointments: { start: Date; end: Date }[],
      blockedTimes: IBlockedTime[],
    ): boolean => {
      // Combine all events to check for conflicts
      const allEvents = [
        ...breakEvents,
        ...appointments,
        ...blockedTimes.map((bt) => ({ start: new Date(bt.startTime), end: new Date(bt.endTime) })),
      ];
  
      // Check for any overlap between the selected time and existing events
      return allEvents.some((event) => {
        return (
          moment(start).isBefore(event.end) &&
          moment(end).isAfter(event.start)
        );
      });
    };

      // Function to style calendar slots based on break times
  const getSlotStyle = (
    date: Date,
    isBreakTime: (date: Date) => boolean,
  ) => {
    const style: React.CSSProperties = {
      backgroundColor: isBreakTime(date) ? '#ffcccc' : undefined,
    };
    return { style };
  };
  

  // Calculate the working hours limits (min and max time) for each day
  const getWorkingHoursLimits = (day: Date) => {
    const dayName = moment(day).format('dddd');
    const workingDay = workingHours.find((wh) => wh.day === dayName);

    // Default to 9 AM - 5 PM if no working day is found or the day is off
    if (!workingDay || !workingDay.isDayOn) {
      return {
        min: moment('09:00', 'HH:mm').toDate(),
        max: moment('17:00', 'HH:mm').toDate(),
      };
    }

    return {
      min: moment(workingDay.start, 'HH:mm').toDate(),
      max: moment(workingDay.end, 'HH:mm').toDate(),
    };
  };

  // Check if a given date is an off-day (weekend) or a holiday
  const isOffDayOrHoliday = (date: Date): boolean => {
    const dayName = moment(date).format('dddd');
    const isDayOff = !workingHours.some(
      (wh) => wh.day === dayName && wh.isDayOn,
    );
    const isHoliday = holidays.some((holiday: { date: string }) =>
      moment(holiday.date).isSame(date, 'day'),
    );
    return isDayOff || isHoliday;
  };

  // Generate break events to be blocked on the calendar within the given range
  const getBreakEvents = (startOfRange: Date, endOfRange: Date) => {
    const events: { start: Date; end: Date; title: string }[] = [];
    let currentDay = moment(startOfRange);

    // Loop through each day in the range from startOfRange to endOfRange
    while (currentDay.isSameOrBefore(endOfRange)) {
      const dayName = currentDay.format('dddd');
      const workingDay = workingHours.find((wh) => wh.day === dayName);

      // Add break times for each working day in the range
      if (workingDay && workingDay.isDayOn && workingDay.breaks) {
        workingDay.breaks.forEach((breakTime) => {
          const breakStart = currentDay.clone().set({
            hour: parseInt(breakTime.start.split(':')[0], 10),
            minute: parseInt(breakTime.start.split(':')[1], 10),
          });
          const breakEnd = currentDay.clone().set({
            hour: parseInt(breakTime.end.split(':')[0], 10),
            minute: parseInt(breakTime.end.split(':')[1], 10),
          });
          events.push({
            start: breakStart.toDate(),
            end: breakEnd.toDate(),
            title: 'Break Time',
          });
        });
      }

      currentDay.add(1, 'day'); // Move to the next day in the range
    }

    return events;
  };

  const isBreakTime = (date: Date): boolean => {
    const breakEvents = getBreakEvents(
      moment(date).startOf('day').toDate(),
      moment(date).endOf('day').toDate(),
    );
    return breakEvents.some((breakEvent) =>
      moment(date).isBetween(breakEvent.start, breakEvent.end, null, '[)'),
    );
  };

  return {
    getWorkingHoursLimits,
    isOffDayOrHoliday,
    getBreakEvents,
    isBreakTime,
    hasConflict,
    getSlotStyle,
  };
};

export default useWorkingHours;
