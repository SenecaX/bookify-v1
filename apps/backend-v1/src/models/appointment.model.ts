import { Schema, model, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  customerId: Types.ObjectId;  // References IUser with role 'customer'
  providerId: Types.ObjectId;  // References IUser with role 'provider'
  serviceId: Types.ObjectId;   // Reference to IService
  dateTime: Date;
  endTime: Date;
  status: 'Booked' | 'Completed' | 'Cancelled' | 'Blocked';
  history: Array<{
    status: string;
    timestamp: Date;
  }>;
  rescheduleHistory?: Array<{
    oldDateTime: Date;
    newDateTime: Date;
    rescheduleTimestamp: Date;
  }>;
  cancellationReason?: string;
  cancellationTimestamp?: Date;
  recurrenceRule?: string;
  review?: {
    rating?: number;
    comment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  dateTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Booked', 'Completed', 'Cancelled', 'Blocked'], 
    default: 'Booked', 
    required: true, 
    index: true 
  },
  history: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }
  ],
  rescheduleHistory: [
    {
      oldDateTime: { type: Date, required: true },
      newDateTime: { type: Date, required: true },
      rescheduleTimestamp: { type: Date, required: true }
    }
  ],
  cancellationReason: { type: String },
  cancellationTimestamp: { type: Date },
  recurrenceRule: { type: String },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, {
  timestamps: true
});

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema);
