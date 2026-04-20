import { Router } from 'express';
import { sendMessage, getMessages, getConversations, createAnnouncement, getAnnouncements } from '../controllers/chat.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/messages', sendMessage);
router.get('/messages/:userId', getMessages);
router.get('/conversations', getConversations);
router.post('/announcements', authorize('school_admin', 'teacher'), createAnnouncement);
router.get('/announcements', getAnnouncements);

export default router;
