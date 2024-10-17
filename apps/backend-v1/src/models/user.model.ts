import { Schema, Document, model } from 'mongoose';

// IUser Schema Definition
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  isActive: boolean;
  role: 'admin' | 'provider' | 'customer';
  companyId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Provider-specific fields
  servicesOffered?: {
    serviceId: Schema.Types.ObjectId;
    serviceName: string;
  }[];
  workingHours?: {
    day: string;  // Align to company model structure
    start: string;
    end: string;
    breaks?: { start: string; end: string }[];
    bufferTime?: number;
  }[];
  unavailablePeriods?: {
    startDateTime: Date;
    endDateTime: Date;
  }[];
  notificationSettings?: {
    type: string;
    enabled: boolean;
  }[];
}

// Subdocument for working hours
const WorkingHoursSchema = new Schema({
  day: { type: String, required: true },  // Change from 'days' to single 'day'
  start: { type: String, required: true },  // Time in format "HH:mm"
  end: { type: String, required: true },    // Time in format "HH:mm"
  breaks: [{
    start: { type: String, required: true },
    end: { type: String, required: true }
  }],
  bufferTime: { type: Number }  // Time in minutes between appointments
});

// Subdocument for unavailable periods
const UnavailablePeriodSchema = new Schema({
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true }
});

// Subdocument for services offered
const ServicesOfferedSchema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true }
});

// Subdocument for notification settings
const NotificationSettingsSchema = new Schema({
  type: { type: String, required: true },  // e.g., "reminder", "updates"
  enabled: { type: Boolean, default: true }
});

// Schema Definition
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['admin', 'provider', 'customer'], required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },  // Corrected to use Schema.Types.ObjectId
  
  // Provider-specific fields
  servicesOffered: [ServicesOfferedSchema],
  workingHours: [WorkingHoursSchema],
  unavailablePeriods: [UnavailablePeriodSchema],
  notificationSettings: [NotificationSettingsSchema],
}, { timestamps: true });

// Role-based validation to ensure provider-specific fields are only present for provider roles
UserSchema.pre('save', function(next) {
  const user = this as IUser;

  if (user.role !== 'provider') {
    // If the user is not a provider, remove provider-specific fields
    user.servicesOffered = undefined;
    user.workingHours = undefined;
    user.unavailablePeriods = undefined;
    user.notificationSettings = undefined;
  }

  next();
});

// Validation: Ensure required fields based on user role
UserSchema.pre('validate', function(next) {
  const user = this as IUser;

  // if (user.role === 'provider') {
  //   if (!user.servicesOffered || !user.servicesOffered.length) {
  //     return next(new Error('Provider must have at least one service offered.'));
  //   }
  //   if (!user.workingHours || !user.workingHours.length) {
  //     return next(new Error('Provider must have working hours defined.'));
  //   }
  // }
  
  next();
});

export const User = model<IUser>('User', UserSchema);

export default UserSchema;
