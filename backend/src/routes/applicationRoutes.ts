import { Router } from 'express';
import { getMyApplications, getApplicationById } from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/my', getMyApplications);
router.get('/:id', getApplicationById);

export default router;
