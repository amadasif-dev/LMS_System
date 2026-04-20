import { Response, NextFunction } from 'express';
import Quiz from '../models/Quiz';
import QuizResult from '../models/QuizResult';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.create({ ...req.body, tenantId: req.user?.tenantId, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const getQuizzes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (courseId) query.courseId = courseId;

    const quizzes = await Quiz.find(query)
      .populate('courseId', 'title')
      .populate('createdBy', 'firstName lastName')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Quiz.countDocuments(query);
    res.json({ success: true, data: quizzes, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!quiz) throw createError('Quiz not found', 404);
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!quiz) throw createError('Quiz not found', 404);
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!quiz) throw createError('Quiz not found', 404);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw createError('Quiz not found', 404);

    const { answers, startedAt } = req.body;
    let obtainedMarks = 0;
    const processedAnswers = answers.map((ans: any, idx: number) => {
      const question = quiz.questions[idx];
      const isCorrect = question?.type === 'mcq' && ans.answer === question.correctAnswer;
      const marks = isCorrect ? question.marks : 0;
      obtainedMarks += marks;
      return { questionIndex: idx, answer: ans.answer, isCorrect, marksObtained: marks };
    });

    const percentage = (obtainedMarks / quiz.totalMarks) * 100;
    const result = await QuizResult.create({
      quizId: quiz._id,
      studentId: req.user?.id,
      tenantId: req.user?.tenantId,
      answers: processedAnswers,
      totalMarks: quiz.totalMarks,
      obtainedMarks,
      percentage,
      isPassed: obtainedMarks >= quiz.passingMarks,
      attemptNumber: 1,
      startedAt: new Date(startedAt),
      completedAt: new Date(),
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getQuizResults = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const results = await QuizResult.find({ quizId: req.params.id, tenantId: req.user?.tenantId })
      .populate('studentId', 'firstName lastName email');
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
