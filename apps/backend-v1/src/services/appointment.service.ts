import moment, { Moment } from 'moment-timezone';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { Types } from 'mongoose';
import { Appointment } from '../models/appointment.model';
import { BlockedTimeRepository } from '../repositories/blockedTime.repository';
import { validateBlockTimeData } from '../validations/blockedTime.validation';


const blockedTimeRepository = new BlockedTimeRepository();

const appointmentRepository = new AppointmentRepository();

// Type definitions for working hours and breaks
interface WorkingHours {
  day: string;  // Single day (e.g., 'Monday')
  start: string;
  end: string;
  breaks?: Array<{ start: string; end: string }>;
}

export const getProviderAvailableSlots = async (
  providerId: string,
  serviceId: string,
  selectedDate: moment.Moment,
  role: string
): Promise<{ status: number; code: string; message: string; data?: { availableSlots: string[] } }> => {
  let availableSlots: string[] = [];

  try {
    console.log('--- Fetching Provider and Service ---');
    // Step 1: Fetch provider and service
    const provider = await appointmentRepository.findProviderById(providerId);
    if (!provider) {
      return {
        status: 404,
        code: 'PROVIDER_NOT_FOUND',
        message: `Provider with ID ${providerId} not found`,
      };
    }
    console.log('Provider fetched:', provider);

    const service = await appointmentRepository.findServiceById(serviceId);
    if (!service) {
      return {
        status: 404,
        code: 'SERVICE_NOT_FOUND',
        message: `Service with ID ${serviceId} not found`,
      };
    }
    console.log('Service fetched:', service);

    // Step 2: Get working hours from provider or fallback to company
    let workingHours: WorkingHours[] | undefined = provider.workingHours;
    console.log('Initial Working Hours:', workingHours);

    if (!workingHours || workingHours.length === 0) {
      console.log('Provider has no working hours. Fetching company working hours...');
      const companyId = new Types.ObjectId(provider.companyId.toString());
      const company = await appointmentRepository.findCompanyById(companyId);
      if (!company || !company.workingHours || company.workingHours.length === 0) {
        console.log('No company working hours found.');
        return {
          status: 200,
          code: 'NO_WORKING_HOURS',
          message: 'No working hours available for the provider or company',
          data: { availableSlots: [] },
        };
      }
      workingHours = company.workingHours;
      console.log('Company Working Hours:', workingHours);
    }

    // Step 3: Filter working hours for the requested day
    const dayOfWeek = selectedDate.format('dddd'); // e.g., 'Monday'
    console.log(`Filtering working hours for: ${dayOfWeek}`);
    const hoursForDay = workingHours.find(
      (hours: WorkingHours) => hours.day.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!hoursForDay) {
      console.log(`No working hours found for ${dayOfWeek}.`);
      return {
        status: 200,
        code: 'NO_WORKING_HOURS_FOR_DAY',
        message: `No working hours found for ${dayOfWeek}`,
        data: { availableSlots: [] },
      };
    }
    // Step 4: Generate time slots using service duration and buffer time
    console.log('--- Generating Time Slots ---');
    // Construct startTime and endTime with the selected date and timezone
    const [startHour, startMinute] = hoursForDay.start.split(':').map(Number);
    const [endHour, endMinute] = hoursForDay.end.split(':').map(Number);

    const timezone = 'UTC'; // You can replace this with provider.timezone if available

    const startTime = moment.tz(selectedDate, timezone).set({
      hour: startHour,
      minute: startMinute,
      second: 0,
      millisecond: 0,
    });
    const endTime = moment.tz(selectedDate, timezone).set({
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0,
    });

    // Validate constructed times
    if (!startTime.isValid() || !endTime.isValid()) {
      return {
        status: 400,
        code: 'INVALID_TIME',
        message: 'Invalid start or end time constructed',
      };
    }

    // Generate the available slots
    availableSlots = generateTimeSlots(
      startTime,
      endTime,
      hoursForDay.breaks || [],
      service.duration, // Use service duration for slot length
      service.bufferDuration // Use service buffer time between slots
    );
    console.log('Generated Slots before Filtering:', availableSlots);

    // Step 5: Fetch existing appointments for the provider and remove booked slots
    console.log('--- Fetching Existing Appointments ---');
    const appointments = await appointmentRepository.findAppointments(
      providerId,
      role,
      "own",
      startTime.toDate(),
      endTime.toDate()
    );
    console.log('Appointments Fetched:', appointments);

    const bookedSlots = appointments.data.map(appointment =>
      moment(appointment.dateTime).tz(timezone).format('HH:mm')
    );
    console.log('Booked Slots:', bookedSlots);

    availableSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));
    console.log('Available Slots after Filtering:', availableSlots);

    return {
      status: 200,
      code: 'SLOTS_AVAILABLE',
      message: 'Available slots fetched successfully',
      data: { availableSlots },
    };
  } catch (error) {
    console.error('Error in getProviderAvailableSlots:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Failed to fetch available slots',
    };
  }
};


// Utility function to generate time slots, excluding breaks and considering buffer time
function generateTimeSlots(
  start: Moment,
  end: Moment,
  breaks: Array<{ start: string; end: string }>,
  serviceDuration: number,
  bufferDuration: number
): string[] {
  const slots: string[] = [];
  let currentTime = start.clone();

  console.log('--- Generating Slots ---');
  console.log('Service Duration:', serviceDuration, 'minutes');
  console.log('Buffer Duration:', bufferDuration, 'minutes');

  while (currentTime.isBefore(end)) {
    // Check if current time is within a break period
    const inBreak = breaks.some(breakPeriod => {
      // Construct break start and end times on the same day as currentTime
      const breakStart = currentTime.clone().set({
        hour: parseInt(breakPeriod.start.split(':')[0], 10),
        minute: parseInt(breakPeriod.start.split(':')[1], 10),
        second: 0,
        millisecond: 0,
      });
      const breakEnd = currentTime.clone().set({
        hour: parseInt(breakPeriod.end.split(':')[0], 10),
        minute: parseInt(breakPeriod.end.split(':')[1], 10),
        second: 0,
        millisecond: 0,
      });

      // Check if currentTime is within the break
      return currentTime.isSameOrAfter(breakStart) && currentTime.isBefore(breakEnd);
    });

    if (!inBreak) {
      slots.push(currentTime.format('HH:mm'));
      console.log('Added Slot:', currentTime.format('HH:mm'));
    } else {
      console.log('Current Time is within a break:', currentTime.format('HH:mm'));
    }

    // Add service duration and buffer to the current time
    currentTime.add(serviceDuration + bufferDuration, 'minutes');
  }

  console.log('Total Slots Generated:', slots.length);
  return slots;
}


export const createAppointment = async (
  customerId: string,
  providerId: string,
  serviceId: string,
  date: string,
  time: string,
  role: string
): Promise<{ status: number; message: string; data?: any }> => {
  try {
    const appointmentDateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Indian/Reunion').utc().toDate();

    const service = await appointmentRepository.findServiceById(serviceId);
    if (!service) {
      return {
        status: 404,
        message: 'Service not found'
      };
    }

    if (!service.duration || service.duration <= 0) {
      return {
        status: 400,
        message: 'Service duration is missing or invalid'
      };
    }

    const endTime = new Date(appointmentDateTime.getTime() + service.duration * 60000);

    const overlappingAppointments = await appointmentRepository.findAppointments(providerId, role, "own", appointmentDateTime, endTime);
    
    if (overlappingAppointments.data && overlappingAppointments.data.length > 0) {
      return {
        status: 409,
        message: 'Time slot is already booked'
      };
    }

    const newAppointment = new Appointment({
      customerId: new Types.ObjectId(customerId),
      providerId: new Types.ObjectId(providerId),
      serviceId: new Types.ObjectId(serviceId),
      dateTime: appointmentDateTime,
      endTime,
      status: 'Booked',
      history: [{ status: 'Booked', timestamp: new Date() }],
    });

    await newAppointment.save();

    return {
      status: 201,
      message: 'Appointment created successfully',
      data: newAppointment
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      status: 500,
      message: 'Failed to create appointment',
    };
  }
};

export const fetchAppointments = async (
  userId: Types.ObjectId | string,
  role: string,
  scope: string,
  startDate: Date,
  endDate: Date,
  statusArray: string[] // New parameter for statuses
): Promise<any> => {
  try {
    const appointments = await appointmentRepository.findAppointments(userId as string, role, scope, startDate, endDate, statusArray);

   // Check if the appointments data array is empty
   if (!appointments.data || !appointments.data.length) {
    return { status: 404, message: 'No appointments found within the specified date range', data: null };
  }

  return appointments; 
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { status: 500, message: 'Unable to fetch appointments', error };
  }
};

// Block provider time
export const blockProviderTime = async (
  providerId: string | Types.ObjectId,
  startTime: Date,
  endTime: Date,
  reason?: string
): Promise<any> => {
  const validation = validateBlockTimeData({ startTime, endTime });
  if (!validation.isValid) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: validation.errors,
    };
  }

  try {
    const blockedTime = await blockedTimeRepository.createBlockedTime({
      providerId: new Types.ObjectId(providerId),
      startTime: startTime,
      endTime: endTime,
      reason: reason || '',
    });

    return {
      status: 201,
      code: 'TIME_BLOCKED',
      message: 'Time blocked successfully for the provider.',
      data: blockedTime,
    };
  } catch (error) {
    console.error('Error blocking time:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to block time.',
    };
  }
};


// Service to fetch blocked times by provider
// Service to fetch blocked times by provider and date range
export const fetchBlockedTimesByProvider = async (providerId: string | Types.ObjectId, start: string, end: string): Promise<any> => {
  try {
    const blockedTimes = await blockedTimeRepository.findBlockedTimesByProviderAndDateRange(providerId as any, start, end);
    
    if (!blockedTimes || blockedTimes.length === 0) {
      return {
        status: 404,
        code: 'NO_BLOCKED_TIMES',
        message: 'No blocked times found for this provider within the specified date range.',
      };
    }

    return {
      status: 200,
      code: 'BLOCKED_TIMES_FETCHED',
      message: 'Blocked times fetched successfully.',
      data: blockedTimes,
    };
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to fetch blocked times.',
    };
  }
};

// Service to handle appointment cancellation
export const cancelAppointment = async (
  appointmentId: string | Types.ObjectId,
  cancellationReason: string
): Promise<any> => {
  try {
    // Validate appointmentId
    if (!appointmentId) {
      return {
        status: 400,
        code: 'APPOINTMENT_ID_MISSING',
        message: 'Appointment ID is missing.',
      };
    }

    // Cancel the appointment
    const updatedAppointment = await appointmentRepository.cancelAppointmentById(
      appointmentId.toString(),
      cancellationReason
    );

    if (!updatedAppointment) {
      return {
        status: 404,
        code: 'APPOINTMENT_NOT_FOUND',
        message: 'Appointment not found.',
      };
    }

    return {
      status: 200,
      code: 'APPOINTMENT_CANCELLED',
      message: 'Appointment cancelled successfully.',
      data: updatedAppointment,
    };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to cancel appointment.',
    };
  }
};


export const editAppointment = async (
  appointmentId: string,
  customerId: string,
  providerId: string,
  serviceId: string,
  date: string,
  time: string,
  role: string
): Promise<{ status: number; message: string; data?: any }> => {
  try {
    const appointmentDateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Indian/Reunion').utc().toDate();

    const service = await appointmentRepository.findServiceById(serviceId);
    if (!service) {
      return {
        status: 404,
        message: 'Service not found'
      };
    }

    if (!service.duration || service.duration <= 0) {
      return {
        status: 400,
        message: 'Service duration is missing or invalid'
      };
    }

    const endTime = new Date(appointmentDateTime.getTime() + service.duration * 60000);

    // Find the existing appointment by ID
    const existingAppointment = await appointmentRepository.findAppointmentById(appointmentId);
    if (!existingAppointment) {
      return {
        status: 404,
        message: 'Appointment not found'
      };
    }

    // Check for overlapping appointments with the new time
    const overlappingAppointments = await appointmentRepository.findAppointments(providerId, role, "own", appointmentDateTime, endTime);
    if (overlappingAppointments.data.length > 0 && overlappingAppointments[0]._id.toString() !== appointmentId) {
      return {
        status: 409,
        message: 'Time slot is already booked'
      };
    }

    // Update the existing appointment
    existingAppointment.customerId = new Types.ObjectId(customerId);
    existingAppointment.providerId = new Types.ObjectId(providerId);
    existingAppointment.serviceId = new Types.ObjectId(serviceId);
    existingAppointment.dateTime = appointmentDateTime;
    existingAppointment.endTime = endTime;
    existingAppointment.status = 'Booked';

    // Add history entry for the update
    existingAppointment.history.push({ status: 'Edited', timestamp: new Date() });

    await existingAppointment.save();

    return {
      status: 200,
      message: 'Appointment updated successfully',
      data: existingAppointment
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return {
      status: 500,
      message: 'Failed to update appointment',
    };
  }
};
