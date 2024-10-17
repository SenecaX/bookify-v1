import { Request } from 'express';
import { IUser } from '../models/user.model';

// Add generics for params, query, and body
export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request {
  user: IUser;
  params: P;      // Generic type for route params
  body: ReqBody;  // Generic type for request body
  query: ReqQuery; // Generic type for query params
}
