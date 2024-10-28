import { Appointment, IAppointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Company, ICompany } from '../models/company.model';
import { Service } from '../models/service.model';
import { Types } from 'mongoose';

export class AppointmentRepository {
  
  // Fetch provider by ID
  async findProviderById(providerId: string) {
    return await User.findById(providerId).exec();
  }

  // Fetch company by provider's company ID
  async findCompanyById(companyId: Types.ObjectId): Promise<ICompany | null> {
    return await Company.findById(companyId).exec();
  }

  // Fetch service by ID
  async findServiceById(serviceId: string) {
    return await Service.findById(serviceId).exec();
  }

  async findAppointments(
    userId: string,
    role: string,
    scope: string,  // New parameter to handle "own" vs. "all" views
    startDate: Date,
    endDate: Date,
    statusArray: string[] = [],
    providerId?: string // Optional for provider filtering
  ) {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid start or end date.');
  
    const query: any = {
      dateTime: { $gte: startDate, $lt: endDate }
    };
  
    // Apply user-specific filters based on scope and role
    if (scope === 'own') {
      if (role === 'provider') {
        query.providerId = userId;
      } else if (role === 'customer') {
        query.customerId = userId;
      }
    } else if (scope === 'all') {
      if (role === 'provider' && providerId) {
        query.providerId = providerId; // Providers viewing all can filter by specific provider
      }
      // Admin sees all without additional filters
    }
  
    // Add status filter if provided
    if (statusArray.length > 0) {
      query.status = { $in: statusArray };
    }
  
    const appointments = await Appointment.find(query).exec();
    return appointments.length
      ? { status: 200, message: 'Appointments fetched successfully', data: appointments }
      : { status: 404, message: 'No appointments found within the specified date range', data: null };
  }  

  // Method to cancel an appointment by ID
  async cancelAppointmentById(
    appointmentId: string,
    cancellationReason: string
  ): Promise<IAppointment | null> {
    const currentDate = new Date();
    return await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'Cancelled', // Update status to 'Cancelled'
        cancellationReason, // Set the reason for cancellation
        cancellationTimestamp: currentDate, // Set cancellation timestamp
        $push: {
          history: { status: 'Cancelled', timestamp: currentDate },
        }, // Push cancellation to history
      },
      { new: true } // Return the updated document
    ).exec();
  }

  async findAppointmentById(appointmentId: string): Promise<IAppointment | null> {
    return await Appointment.findById(appointmentId).exec();
  }
}