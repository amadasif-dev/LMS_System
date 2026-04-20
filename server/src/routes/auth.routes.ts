import { Router } from 'express';
import { register, login, getMe, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/refresh-token', refreshToken);

export default router;
