import { Router } from 'express';
import { createAssignment, getAssignments, getAssignment, updateAssignment, deleteAssignment, submitAssignment, getSubmissions, gradeSubmission } from '../controllers/assignment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.post('/', authorize('school_admin', 'teacher'), createAssignment);
router.put('/:id', authorize('school_admin', 'teacher'), updateAssignment);
router.delete('/:id', authorize('school_admin', 'teacher'), deleteAssignment);
router.post('/:id/submit', authorize('student'), submitAssignment);
router.get('/:id/submissions', authorize('school_admin', 'teacher'), getSubmissions);
router.put('/submissions/:submissionId/grade', authorize('teacher'), gradeSubmission);

export default router;
