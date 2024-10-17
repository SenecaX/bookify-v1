import { Schema, model, Document, Types } from 'mongoose';

export interface IBlockedTime extends Document {
  providerId: Types.ObjectId;   // References IUser with role 'provider'
  startTime: Date;              // Start time of the blocked period
  endTime: Date;                // End time of the blocked period
  reason?: string;              // Optional reason for blocking the time
  status: 'Active' | 'Cancelled';  // Blocked time status
  cancellationReason?: string;  // Optional reason for cancelling the blocked time
  cancellationTimestamp?: Date; // Timestamp of when the blocked time was cancelled
  createdAt: Date;              // Automatically managed by mongoose
  updatedAt: Date;              // Automatically managed by mongoose
}

const BlockedTimeSchema = new Schema<IBlockedTime>({
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Always required
  startTime: { type: Date, required: true },  // The time the block starts
  endTime: { type: Date, required: true },    // The time the block ends
  reason: { type: String },  // Optional reason for blocking time (e.g., personal break)
  status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active', required: true },  // Blocked time status
  cancellationReason: { type: String },  // Optional reason for cancelling blocked time
  cancellationTimestamp: { type: Date }, // Timestamp for cancellation
}, {
  timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

export const BlockedTime = model<IBlockedTime>('BlockedTime', BlockedTimeSchema);
