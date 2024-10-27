import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { UserRepository } from '../repositories/user.repository';

interface ResponseData {
  status: number;
  code: string;
  message: string;
  data?: any;
  details?: any;
}

const userRepository = new UserRepository();

export const loginUser = async (credentials: any, path: string): Promise<ResponseData> => {
  const { error, value } = loginSchema.validate(credentials, { abortEarly: false });
  if (error) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  const user = await userRepository.findUserByEmail(value.email);
  if (!user) {
    return {
      status: 401,
      code: 'AUTHENTICATION_FAILED',
      message: 'Invalid email or password',
      details: {
        field: 'general',
        message: 'The email or password you entered is incorrect.',
      },
    };
  }

  const passwordMatch = await bcrypt.compare(value.password, user.password);
  if (!passwordMatch) {
    return {
      status: 401,
      code: 'AUTHENTICATION_FAILED',
      message: 'Invalid email or password',
      details: {
        field: 'general',
        message: 'The email or password you entered is incorrect.',
      },
    };
  }

  // **Role-based access control**: 
  if (path === '/login/customer' && user.role !== 'customer') {
    return {
      status: 403,
      code: 'FORBIDDEN',
      message: 'Access forbidden for non-customer roles',
    };
  }

  if (path === '/login' && user.role === 'customer') {
    return {
      status: 403,
      code: 'FORBIDDEN',
      message: 'Access forbidden for customers',
    };
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET || 'yourSecretKey',
    { expiresIn: '24h' }
  );

  return {
    status: 200,
    code: 'LOGIN_SUCCESS',
    message: 'Login successful',
    data: {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
      expiresIn: 24 * 60 * 60, // in seconds
    },
  };
};


export const registerUser = async (userData: any): Promise<ResponseData> => {
  const { error, value } = registerSchema.validate(userData, { abortEarly: false });
  if (error) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  const existingUser = await userRepository.findUserByEmail(value.email);
  if (existingUser) {
    return {
      status: 400,
      code: 'USER_EXISTS',
      message: 'User already exists',
    };
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);
  const user = await userRepository.createUser({
    ...value,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = user.toObject();

  // Generate JWT Token
  const token = jwt.sign(
    { id: userWithoutPassword._id, email: userWithoutPassword.email, role: userWithoutPassword.role, companyId: userWithoutPassword.companyId },
    process.env.JWT_SECRET || 'yourSecretKey', // Use a secret from your env file
    { expiresIn: '24h' } // Token expires in 1 hour
  );

  return {
    status: 201,
    code: 'USER_CREATED',
    message: `${value.role} created successfully`,
    data: {
      user: userWithoutPassword,
      token, // Include the generated token in the response
    },
  };
};