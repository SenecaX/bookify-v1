import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { cancelBlockedTime } from '../services/blockedTime.service';

// Controller to handle blocked time cancellation
export const cancelBlockedTimeController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { blockedTimeId } = req.params;
    const { reason } = req.body; // Extract cancellation reason from the request body
    const result = await cancelBlockedTime(blockedTimeId, reason);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};
