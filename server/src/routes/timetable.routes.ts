import { Router } from 'express';
import { createTimetable, getTimetable, updateTimetable, deleteTimetable } from '../controllers/timetable.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getTimetable);
router.post('/', authorize('school_admin'), createTimetable);
router.put('/:id', authorize('school_admin'), updateTimetable);
router.delete('/:id', authorize('school_admin'), deleteTimetable);

export default router;
