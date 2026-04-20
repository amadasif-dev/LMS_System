import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'school_admin', 'teacher'), (req, _res, next) => {
  req.query.role = 'student';
  next();
}, getUsers);
router.get('/:id', getUser);
router.post('/', authorize('super_admin', 'school_admin'), (req, _res, next) => {
  req.body.role = 'student';
  next();
}, createUser);
router.put('/:id', authorize('super_admin', 'school_admin'), updateUser);
router.delete('/:id', authorize('super_admin', 'school_admin'), deleteUser);

export default router;
