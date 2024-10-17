import { Router } from 'express';
import { cancelBlockedTimeController } from '../controllers/blockedTime.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route to cancel blocked time
router.put('/:blockedTimeId/cancel', authMiddleware, cancelBlockedTimeController);

export default router;
