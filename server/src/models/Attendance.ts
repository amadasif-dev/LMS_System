import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  method: 'manual' | 'qr';
  markedBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
    method: { type: String, enum: ['manual', 'qr'], default: 'manual' },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ tenantId: 1, date: 1 });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
