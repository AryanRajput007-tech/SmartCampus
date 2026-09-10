import { Router } from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAdminJobs,
  getStudents,
  getAdminApplications,
  updateApplicationStatus,
  getDashboardStats
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protect all admin routes with authentication & role authorization
router.use(authenticate);
router.use(authorize('ADMIN'));

// Jobs management
router.post('/jobs', createJob);
router.get('/jobs', getAdminJobs);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Students
router.get('/students', getStudents);

// Applications
router.get('/applications', getAdminApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// Dashboard Statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;
