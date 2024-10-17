import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({
      status: 400,
      code: 'DUPLICATE_KEY',
      message: `Duplicate value for field: ${field}`,
    });
  } else {
    res.status(err.status || 500).json({
      status: err.status || 500,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    });
  }
};
