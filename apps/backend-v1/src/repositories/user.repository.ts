import { IUser, User } from '../models/user.model';

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email, isActive: true }); // Only find if isActive is true
  }
  
  async findUsersByRole(companyId: string, role?: string): Promise<IUser[]> {
    const query: any = { isActive: true, companyId }; // Include companyId in the query
    if (role) {
      query.role = role; // Add role if provided
    }
  
    return User.find(query, '-password'); // Fetch users, excluding password for security
  }
  
  
  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updates, { new: true }).exec();
  }
}
