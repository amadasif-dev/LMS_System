import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress {
  lessonId: string;
  moduleId: string;
  isCompleted: boolean;
  watchTime: number;
  lastPosition: number;
  completedAt?: Date;
}

export interface ICourseProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  lessonsProgress: ILessonProgress[];
  overallProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt: Date;
  bookmarks: string[];
  notes: { lessonId: string; content: string; timestamp: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: String, required: true },
  moduleId: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  watchTime: { type: Number, default: 0 },
  lastPosition: { type: Number, default: 0 },
  completedAt: { type: Date },
});

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    lessonsProgress: [LessonProgressSchema],
    overallProgress: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now },
    bookmarks: [{ type: String }],
    notes: [{
      lessonId: { type: String },
      content: { type: String },
      timestamp: { type: Number },
    }],
  },
  { timestamps: true }
);

CourseProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);
