import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone'; // Ensure you're importing moment-timezone
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { blockProviderTime, cancelAppointment, createAppointment, editAppointment, fetchAppointmentsForProvider, fetchBlockedTimesByProvider, getProviderAvailableSlots } from '../services/appointment.service';

export const fetchAvailableSlotsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const providerId = req.params.providerId; // Extracting providerId from the URL parameters
    const { serviceId, date } = req.query; // Extracting serviceId and date from the query parameters

    // Validate required parameters
    if (!providerId || !serviceId || !date) {
       res.status(400).json({ message: 'providerId, serviceId, and date are required.' });
    }

    // Validate the date format using strict parsing
    const selectedDate = moment.tz(date as string, 'YYYY-MM-DD', true, 'UTC'); // Specify timezone
    if (!selectedDate.isValid()) {
       res.status(400).json({ message: 'Invalid date format. Expected format: YYYY-MM-DD.' });
    }

    // Fetch available slots
    const availableSlots = await getProviderAvailableSlots(
      providerId,
      serviceId as string,
      selectedDate
    );
    res.status(200).json(availableSlots);
  } catch (error) {
    next(error);
  }
};

export const bookAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerId, providerId, serviceId, date, time } = req.body;

    // Validate required fields
    if (!customerId || !providerId || !serviceId || !date || !time) {
       res.status(400).json({ message: 'Customer ID, Provider ID, Service ID, Date, and Time are required.' });
    }

    // Call the service layer to handle appointment creation
    const result = await createAppointment(customerId, providerId, serviceId, date, time);

    // Return the status code directly from the service result
     res.status(result.status).json(result);
    
  } catch (error) {
    next(error);  // Handle errors in the middleware
  }
};


export const fetchProviderAppointmentsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { providerId, start, end } = req.query;  // Extract providerId, start, and end from query parameters

    // Check if required query parameters are provided
    if (!providerId || !start || !end) {
      res.status(400).json({ message: 'Provider ID, start, and end dates are required' });
      return;
    }

    // Fetch appointments for the specified providerId
    const result = await fetchAppointmentsForProvider(providerId as any, new Date(start as string), new Date(end as string));

    // Send the result back to the client
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const blockProviderTimeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { providerId } = req.params;
    const { startTime, endTime, reason } = req.body;

    // Call the service to block time for the provider
    const result = await blockProviderTime(providerId, startTime, endTime, reason);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};


export const fetchBlockedTimesByProviderController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { providerId } = req.params;
    const { start, end } = req.query;

    const result = await fetchBlockedTimesByProvider(providerId, start as string, end as string);
    res.status(result.status).json(result);  // Return the result from the service
  } catch (error) {
    next(error);  // Handle the error
  }
};

// Controller to handle appointment cancellation
export const cancelAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body; // Extract cancellation reason from the request body
    const result = await cancelAppointment(appointmentId, reason);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const editAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const { customerId, providerId, serviceId, date, time } = req.body;

    // Validate required fields
    if (!appointmentId || !customerId || !providerId || !serviceId || !date || !time) {
       res.status(400).json({ message: 'Appointment ID, Customer ID, Provider ID, Service ID, Date, and Time are required.' });
    }

    // Call the service layer to handle appointment update
    const result = await editAppointment(appointmentId, customerId, providerId, serviceId, date, time);

    // Return the status code directly from the service result
    res.status(result.status).json(result);

  } catch (error) {
    next(error);  // Handle errors in the middleware
  }
};
