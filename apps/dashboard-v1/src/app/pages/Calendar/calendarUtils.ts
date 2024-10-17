import moment, { Moment } from 'moment';
import { View } from 'react-big-calendar';
import { Appointment, BlockedTime } from './mockAppointments';
import { IBlockedTime } from '../../types';

// Helper function to determine the unit of time (startOf) based on the view
export const getViewUnit = (view: View): moment.unitOfTime.StartOf => {
  switch (view) {
    case 'month':
      return 'month';
    case 'week':
      return 'week';
    case 'day':
      return 'day';
    default:
      return 'week'; // Default to week if the view is unknown
  }
};

// Calculate the start and end of the current visible range based on the view and current date
export const calculateStartAndEndDates = (currentDate: Moment, currentView: View) => {
  const startOfRange = moment(currentDate).startOf(getViewUnit(currentView));
  const endOfRange = moment(currentDate).endOf(getViewUnit(currentView));
  return { startOfRange, endOfRange };
};

export const handleDateChange = (
  newDate: Moment,
  view: View,
  setCurrentDate: (date: Moment) => void,
  setEndDate: (date: Moment) => void,
) => {
  const { startOfRange, endOfRange } = calculateStartAndEndDates(newDate, view);
  setCurrentDate(startOfRange);
  setEndDate(endOfRange);
};


export const createEvents = (appointments: Appointment[], blockedTimes: IBlockedTime[]) => {
  const appointmentEvents = appointments.map((appointment) => ({
    title: 'Booked Appointment',
    start: moment(appointment.dateTime).toDate(),
    end: appointment.endTime 
      ? moment(appointment.endTime).toDate() 
      : moment(appointment.dateTime).add(1, 'hour').toDate(),
    allDay: false,
    resource: appointment,
  }));

  const blockedTimeEvents = blockedTimes.map((blockedTime) => ({
    title: 'Blocked Time',
    start: moment(blockedTime.startTime).toDate(),  // Convert string to Date
    end: moment(blockedTime.endTime).toDate(),      // Convert string to Date
    allDay: false,
    resource: blockedTime,
    color: 'gray',
  }));

  return [...appointmentEvents, ...blockedTimeEvents];
};
