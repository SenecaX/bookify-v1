import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token required' });
    return;  // Ensure the middleware ends by returning `void`
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey') as IUser;
    console.log("decoded", decoded);

    // Attach user to request using type assertion
    (req as AuthenticatedRequest).user = decoded;

    next();  // Proceed to the next middleware or controller
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;  // Ensure the middleware ends by returning `void`
  }
};
