import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  isActive: boolean;
  settings: {
    maxStudents: number;
    maxTeachers: number;
    maxCourses: number;
  };
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    logo: { type: String },
    primaryColor: { type: String, default: '#4F46E5' },
    plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
    isActive: { type: Boolean, default: true },
    settings: {
      maxStudents: { type: Number, default: 100 },
      maxTeachers: { type: Number, default: 20 },
      maxCourses: { type: Number, default: 50 },
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITenant>('Tenant', TenantSchema);
