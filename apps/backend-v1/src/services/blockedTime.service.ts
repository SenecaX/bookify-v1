import { Types } from 'mongoose';
import { BlockedTimeRepository } from '../repositories/blockedTime.repository';

const blockedTimeRepository = new BlockedTimeRepository();

// Service to handle blocked time cancellation
export const cancelBlockedTime = async (
  blockedTimeId: string | Types.ObjectId,
  cancellationReason: string
): Promise<any> => {
  try {
    // Validate blockedTimeId
    if (!blockedTimeId) {
      return {
        status: 400,
        code: 'BLOCKED_TIME_ID_MISSING',
        message: 'Blocked time ID is missing.',
      };
    }

    // Cancel the blocked time in the repository
    const updatedBlockedTime = await blockedTimeRepository.cancelBlockedTimeById(
      blockedTimeId.toString(),
      cancellationReason
    );

    if (!updatedBlockedTime) {
      return {
        status: 404,
        code: 'BLOCKED_TIME_NOT_FOUND',
        message: 'Blocked time not found.',
      };
    }

    return {
      status: 200,
      code: 'BLOCKED_TIME_CANCELLED',
      message: 'Blocked time cancelled successfully.',
      data: updatedBlockedTime,
    };
  } catch (error) {
    console.error('Error cancelling blocked time:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to cancel blocked time.',
    };
  }
};
