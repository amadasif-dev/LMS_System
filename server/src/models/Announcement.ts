import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  tenantId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  audience: 'all' | 'students' | 'teachers' | 'parents';
  courseId?: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    audience: { type: String, enum: ['all', 'students', 'teachers', 'parents'], default: 'all' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ tenantId: 1, createdAt: -1 });

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
