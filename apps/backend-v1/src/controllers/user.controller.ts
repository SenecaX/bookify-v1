import { Response, NextFunction } from 'express';
import { createUser, deleteUser, editUser, fetchUsers } from '../services/user.service';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export const fetchUsersController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.query; 
    const companyId = req.user.companyId; 
    
    if (!companyId) {
       res.status(400).json({
        status: 400,
        code: 'COMPANY_ID_MISSING',
        message: 'Company ID is required',
      });
    }

    const result = await fetchUsers(companyId as any, role as string); // Pass companyId to service
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};


export const editUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const result = await editUser(userId, updates);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await deleteUser(userId);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = req.user; // Fetch the logged-in admin from the request
    const userData = req.body; // User data from the request body

    // Call the createUser service with user data and admin details
    const result = await createUser(userData, admin);

    // Return the appropriate response
    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Handle any server errors
  }
};