import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'cash' | 'card' | 'bank_transfer' | 'online';
  invoiceNumber: string;
  description: string;
  feeStructureId?: mongoose.Types.ObjectId;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    method: { type: String, enum: ['cash', 'card', 'bank_transfer', 'online'], required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure' },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

PaymentSchema.index({ tenantId: 1, studentId: 1 });
PaymentSchema.index({ invoiceNumber: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
