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

  async findAppointments(userId: string, role: string, start: Date, end: Date, statusArray: string[] = []) {
    if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid start or end date provided to findAppointments.');
    
    const query: any = {
      [role === 'provider' ? 'providerId' : 'customerId']: userId,
      dateTime: { $gte: start, $lt: end }
    };
  
    // Add status filter if statuses are provided
    if (statusArray.length > 0) {
      query.status = { $in: statusArray };
    }
  
    return await Appointment.find(query).exec();
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