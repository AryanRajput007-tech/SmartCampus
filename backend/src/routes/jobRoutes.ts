import { Router } from 'express';
import { getJobs, getJobById, applyForJob } from '../controllers/jobController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Publicly viewable by logged in students or guests
router.get('/', getJobs);
router.get('/:id', getJobById);

// Student applying for a job
router.post('/:id/apply', authenticate, authorize('STUDENT'), applyForJob);

export default router;
