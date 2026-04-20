import { Router } from 'express';
import { generateCertificate, getCertificates, verifyCertificate } from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/generate', generateCertificate);
router.get('/', getCertificates);
router.get('/verify/:certNumber', verifyCertificate);

export default router;
