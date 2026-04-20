import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  title: string;
  description?: string;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  dripDate?: Date;
  isPublished: boolean;
}

export interface IModule {
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  teacherId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  modules: IModule[];
  price?: number;
  isPublished: boolean;
  isFree: boolean;
  enrolledStudents: mongoose.Types.ObjectId[];
  tags: string[];
  totalDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['video', 'pdf', 'text', 'quiz'], default: 'video' },
  content: { type: String, default: '' },
  videoUrl: { type: String },
  duration: { type: Number },
  order: { type: Number, required: true },
  dripDate: { type: Date },
  isPublished: { type: Boolean, default: false },
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
});

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    modules: [ModuleSchema],
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
    totalDuration: { type: Number },
  },
  { timestamps: true }
);

CourseSchema.index({ tenantId: 1, category: 1 });
CourseSchema.index({ teacherId: 1 });

export default mongoose.model<ICourse>('Course', CourseSchema);
