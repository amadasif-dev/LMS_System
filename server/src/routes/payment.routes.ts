import { Router } from 'express';
import { createFeeStructure, getFeeStructures, createPayment, getPayments, updatePayment } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/fees', getFeeStructures);
router.post('/fees', authorize('school_admin'), createFeeStructure);
router.get('/', getPayments);
router.post('/', authorize('school_admin'), createPayment);
router.put('/:id', authorize('school_admin'), updatePayment);

export default router;
