import { Schema, model, Document, Types } from 'mongoose';

export interface IService extends Document {
  companyId: Types.ObjectId;  // Reference to Companies
  name: string;
  duration: number;
  bufferDuration: number;
  description: string;
}

const serviceSchema = new Schema<IService>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: false },
    bufferDuration: { type: Number, required: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Service = model<IService>('Service', serviceSchema);
