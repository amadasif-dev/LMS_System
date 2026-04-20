import { Router } from 'express';
import { getDashboardStats, getEnrollmentTrends, getAttendanceStats, getCourseCompletionRates } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/dashboard', authorize('super_admin', 'school_admin'), getDashboardStats);
router.get('/enrollment-trends', authorize('super_admin', 'school_admin'), getEnrollmentTrends);
router.get('/attendance', authorize('super_admin', 'school_admin', 'teacher'), getAttendanceStats);
router.get('/course-completion', authorize('super_admin', 'school_admin'), getCourseCompletionRates);

export default router;
