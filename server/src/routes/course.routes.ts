import { Router } from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, enrollStudent } from '../controllers/course.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authorize('school_admin', 'teacher'), createCourse);
router.put('/:id', authorize('school_admin', 'teacher'), updateCourse);
router.delete('/:id', authorize('school_admin'), deleteCourse);
router.post('/:id/enroll', authorize('student'), enrollStudent);

export default router;
