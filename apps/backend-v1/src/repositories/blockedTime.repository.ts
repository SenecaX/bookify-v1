import { BlockedTime, IBlockedTime } from '../models/blockedTime.model';

export class BlockedTimeRepository {
  async createBlockedTime(blockedTimeData: Partial<IBlockedTime>): Promise<IBlockedTime> {
    const blockedTime = new BlockedTime(blockedTimeData);
    return await blockedTime.save();
  }

  async findBlockedTimesByProviderAndDateRange(providerId: string, start: string, end: string): Promise<IBlockedTime[]> {
    return await BlockedTime.find({
      providerId,
      startTime: { $gte: new Date(start) },  // Filter startTime greater than or equal to start date
      endTime: { $lte: new Date(end) },  // Filter endTime less than or equal to end date
      status: 'Active',
    }).exec();
  }
  

  async deleteBlockedTime(id: string): Promise<IBlockedTime | null> {
    return await BlockedTime.findByIdAndDelete(id).exec();
  }

  // Method to cancel blocked time by ID
  async cancelBlockedTimeById(
    blockedTimeId: string,
    cancellationReason: string
  ): Promise<IBlockedTime | null> {
    return await BlockedTime.findByIdAndUpdate(
      blockedTimeId,
      {
        $set: {
          status: 'Cancelled',  // Update status to 'Cancelled'
          reason: cancellationReason,  // Set cancellation reason
          cancellationTimestamp: new Date(),  // Set cancellation timestamp
        },
      },
      { new: true } // Return the updated document
    ).exec();
  }
}
