import { hash } from 'bcrypt';
import { IUser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { validateUserData } from '../validations/user.validation';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export const fetchUsers = async ( companyId: string, role?: string): Promise<any> => {
  try {
    const users = await userRepository.findUsersByRole(companyId, role); // Pass companyId to the repository
    return {
      status: 200,
      code: 'USERS_FETCHED',
      message: 'Users fetched successfully',
      data: users,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to fetch users',
    };
  }
};

export const editUser = async (userId: string, updates: Partial<IUser>): Promise<any> => {
  try {
    const updatedUser = await userRepository.updateUser(userId, updates);
    if (!updatedUser) {
      return {
        status: 404,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }
    return {
      status: 200,
      code: 'USER_UPDATED',
      message: 'User updated successfully',
      data: updatedUser,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to update user',
    };
  }
};

export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const user = await userRepository.updateUser(userId, { isActive: false });
    if (!user) {
      return {
        status: 404,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }
    return {
      status: 200,
      code: 'USER_DEACTIVATED',
      message: 'User deactivated successfully',
    };
  } catch (error) {
    console.error('Error deactivating user:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to deactivate user',
    };
  }
};

export const createUser = async (userData: IUser, admin: IUser): Promise<any> => {
  console.log('createUser called with data:', userData);

  // If role is missing, default it to 'provider'
  if (!userData.role) {
    userData.role = 'provider';
  }

  // Only admins can create providers
  if (userData.role === 'provider' && admin.role !== 'admin') {
    return {
      status: 403,
      code: 'FORBIDDEN',
      message: 'Only admins can register providers',
    };
  }

  // Validate the user data
  const validation = validateUserData(userData);
  if (!validation.isValid) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: validation.errors,
    };
  }

  // Check if user with this email already exists
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    return {
      status: 409,
      code: 'USER_EXISTS',
      message: 'User with this email already exists',
    };
  }

  try {
    // Hash the password
    const hashedPassword = await hash(userData.password, 10);

    // Create the new user
    const newUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
      companyId: userData.companyId || admin.companyId // Ensure companyId is linked
    });

    // Generate JWT Token if needed
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: '24h' }
    );

    return {
      status: 201,
      code: 'USER_CREATED',
      message: 'User created successfully',
      data: {
        user: newUser,
        token, // Include token if needed
      },
    };
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      return {
        status: 409,
        code: 'USER_EXISTS',
        message: 'User with this email already exists',
      };
    }

    console.error('Error creating user:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred',
    };
  }
};