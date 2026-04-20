import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  text: string;
  type: 'mcq' | 'descriptive';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  courseId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  questions: IQuestion[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isRandomized: boolean;
  maxAttempts: number;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'descriptive'], required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  marks: { type: Number, required: true, default: 1 },
  explanation: { type: String },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [QuestionSchema],
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    isRandomized: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

QuizSchema.index({ courseId: 1, tenantId: 1 });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
