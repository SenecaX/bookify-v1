import { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body, req.path); // Pass the path to service
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};