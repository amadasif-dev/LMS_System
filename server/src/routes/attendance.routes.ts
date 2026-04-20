import { Router } from 'express';
import { markAttendance, getAttendance, getAttendanceReport } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', authorize('school_admin', 'teacher'), markAttendance);
router.get('/', getAttendance);
router.get('/report', authorize('school_admin', 'teacher'), getAttendanceReport);

export default router;
