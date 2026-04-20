import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionIndex: number;
  answer: string;
  isCorrect?: boolean;
  marksObtained: number;
}

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  isPassed: boolean;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionIndex: { type: Number, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean },
  marksObtained: { type: Number, default: 0 },
});

const QuizResultSchema = new Schema<IQuizResult>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    answers: [AnswerSchema],
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    isPassed: { type: Boolean, required: true },
    attemptNumber: { type: Number, default: 1 },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

QuizResultSchema.index({ quizId: 1, studentId: 1 });

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
