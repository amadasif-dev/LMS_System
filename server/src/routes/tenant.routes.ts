import { Router } from 'express';
import { createTenant, getTenants, getTenant, updateTenant, deleteTenant, getTenantStats } from '../controllers/tenant.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', createTenant);
router.get('/', authenticate, authorize('super_admin'), getTenants);
router.get('/stats', authenticate, authorize('super_admin', 'school_admin'), getTenantStats);
router.get('/:id', authenticate, getTenant);
router.put('/:id', authenticate, authorize('super_admin', 'school_admin'), updateTenant);
router.delete('/:id', authenticate, authorize('super_admin'), deleteTenant);

export default router;
