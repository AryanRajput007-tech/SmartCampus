import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Student only routes
router.use(authenticate);
router.use(authorize('STUDENT'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
