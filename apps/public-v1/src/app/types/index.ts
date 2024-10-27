export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId?: string;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface CompanyData {
  _id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  adminId: string;  // ObjectId as string
  workingHours?: {
    day: string;     // Day of the week (e.g., 'Monday')
    isDayOn: boolean; // Whether the day is active
    start: string;  // Start time (e.g., '09:00')
    end: string;    // End time (e.g., '17:00')
    breaks?: {
      start: string;  // Break start time (e.g., '12:00')
      end: string;    // Break end time (e.g., '13:00')
    }[];
  }[];
  holidays?: {
    date: string;      // ISO string date (e.g., '2024-10-09')
    description: string;  // Description of the holiday
    category: string;  // Category of the holiday (e.g., 'national', 'religious')
  }[];
  createdAt: string;  // ISO string date
  updatedAt: string;  // ISO string date
}

export interface IProvider {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  isActive: boolean;
  role: 'admin' | 'provider' | 'customer';
  companyId?: string;  // String type for companyId on frontend
  createdAt: Date;
  updatedAt: Date;
}


export interface IService {
  _id?: string;
  companyId: string;  // String type for companyId on frontend
  name: string;
  duration: number;
  bufferDuration: number;
  description: string;
}

export interface IReview {
  rating: number;         // Rating from 1 to 5
  comment?: string;      // Optional comment
}

export interface IRescheduleHistory {
  oldDateTime: Date;      // Old date and time of the appointment
  newDateTime: Date;      // New date and time of the appointment
  rescheduleTimestamp: Date; // Timestamp when the appointment was rescheduled
}

export interface IHistory {
  status: string;         // Status of the appointment (e.g., 'Booked', 'Completed', 'Cancelled')
  timestamp: Date;       // Timestamp when the status was updated
}


export interface IAppointment {
  _id: string;                   // Unique identifier for the appointment (string for frontend representation)
  customerId: string;            // Reference to the customer (user) ID as a string
  providerId: string;            // Reference to the provider (user) ID as a string
  serviceId: string;             // Reference to the service ID as a string
  dateTime: Date;                // Start date and time of the appointment
  endTime: Date;                 // End date and time of the appointment
  status: 'Booked' | 'Completed' | 'Cancelled'; // Current status of the appointment
  history: IHistory[];           // History of status changes
  rescheduleHistory?: IRescheduleHistory[]; // Optional reschedule history
  cancellationReason?: string;   // Optional reason for cancellation
  cancellationTimestamp?: Date;  // Optional timestamp of cancellation
  recurrenceRule?: string;       // Optional rule for recurring appointments
  review?: IReview;              // Optional review of the appointment
  createdAt: Date;               // Timestamp when the appointment was created
  updatedAt: Date;               // Timestamp when the appointment was last updated
}

export interface User {
  _id: string;           
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;      
  isActive?: boolean;
  address: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  role: 'admin' | 'provider' | 'customer';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
  // Optional auth fields
  token?: string;
  expiresIn?: number;
  userId?: string;
}
