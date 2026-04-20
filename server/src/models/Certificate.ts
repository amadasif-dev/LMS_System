import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  certificateNumber: string;
  issueDate: Date;
  templateData: {
    studentName: string;
    courseName: string;
    completionDate: string;
    grade?: string;
  };
  downloadUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    certificateNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now },
    templateData: {
      studentName: { type: String, required: true },
      courseName: { type: String, required: true },
      completionDate: { type: String, required: true },
      grade: { type: String },
    },
    downloadUrl: { type: String },
  },
  { timestamps: true }
);

CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
