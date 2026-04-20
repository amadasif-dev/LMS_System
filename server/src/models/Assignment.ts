import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  courseId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  deadline: Date;
  totalMarks: number;
  attachments: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    attachments: [{ type: String }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AssignmentSchema.index({ courseId: 1, tenantId: 1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
