import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  fileUrl: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
  status: 'submitted' | 'graded' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    feedback: { type: String },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
    status: { type: String, enum: ['submitted', 'graded', 'returned'], default: 'submitted' },
  },
  { timestamps: true }
);

SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
