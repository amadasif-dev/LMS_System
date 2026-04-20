import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  room?: string;
  liveClassLink?: string;
}

export interface ITimetable extends Document {
  tenantId: mongoose.Types.ObjectId;
  className: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: ITimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  room: { type: String },
  liveClassLink: { type: String },
});

const TimetableSchema = new Schema<ITimetable>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    className: { type: String, required: true },
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    slots: [TimeSlotSchema],
  },
  { timestamps: true }
);

TimetableSchema.index({ tenantId: 1, className: 1, day: 1 }, { unique: true });

export default mongoose.model<ITimetable>('Timetable', TimetableSchema);
