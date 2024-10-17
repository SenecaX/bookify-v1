import { Schema, model, Document, Types } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  adminId: Types.ObjectId;  // Linking company to the admin who created it
  workingHours?: {
    day: string;     // Day of the week (e.g., 'Monday')
    isDayOn: boolean; // Whether the day is active
    start: string;  // Start time (e.g., '09:00')
    end: string;    // End time (e.g., '17:00')
    breaks?: {
      start: string;  // Start time of the break (e.g., '12:00')
      end: string;    // End time of the break (e.g., '13:00')
    }[];
  }[];
  holidays?: {
    date: Date;      // Date of the holiday
    description: string;  // Description of the holiday
    category: string;  // Category of the holiday (e.g., 'national', 'religious')
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const workingHoursSchema = new Schema(
  {
    day: { type: String, required: false },    // Day of the week
    isDayOn: { type: Boolean, required: false }, // Whether the day is active
    start: { type: String, required: false },  // Start time in string format (e.g., '09:00')
    end: { type: String, required: false },    // End time in string format (e.g., '17:00')
    breaks: [
      {
        start: { type: String, required: false }, // Break start time
        end: { type: String, required: false },   // Break end time
      },
    ],
  },
  { _id: false }
);

const holidaySchema = new Schema(
  {
    date: { type: Date, required: true },  // Date of the holiday
    description: { type: String, required: true },  // Description of the holiday
    category: { type: String, required: true },     // Category (e.g., 'national', 'religious')
  },
  { _id: false }
);

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    address: addressSchema,  // Embedded address schema
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the admin user
    workingHours: [workingHoursSchema],  // Array of working hours, one object per day
    holidays: [holidaySchema],  // Array of holidays
  },
  { timestamps: true }  // Automatically handle createdAt and updatedAt fields
);

export const Company = model<ICompany>('Company', companySchema);
