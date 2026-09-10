import { Router } from 'express';
import { matchJob, chatAssistant } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Require authentication for AI features
router.use(authenticate);

router.post('/match', matchJob);
router.post('/chat', chatAssistant);

export default router;
