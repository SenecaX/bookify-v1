import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (allowedRoles.includes(user.role)) {
      next(); // If role is allowed, proceed to the next middleware/controller
    } else {
      res.status(403).json({ message: 'Access forbidden' });
    }
  };
};
