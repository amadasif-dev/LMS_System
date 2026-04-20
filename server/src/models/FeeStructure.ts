import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeStructure extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  className: string;
  amount: number;
  currency: string;
  dueDate: Date;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    className: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    dueDate: { type: Date, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FeeStructureSchema.index({ tenantId: 1 });

export default mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
