import { Router } from 'express';
import { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz, submitQuiz, getQuizResults } from '../controllers/quiz.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getQuizzes);
router.get('/:id', getQuiz);
router.post('/', authorize('school_admin', 'teacher'), createQuiz);
router.put('/:id', authorize('school_admin', 'teacher'), updateQuiz);
router.delete('/:id', authorize('school_admin', 'teacher'), deleteQuiz);
router.post('/:id/submit', authorize('student'), submitQuiz);
router.get('/:id/results', authorize('school_admin', 'teacher'), getQuizResults);

export default router;
