import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { createService, deleteService, editService, fetchServices } from '../services/service.service';

export const createServiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceData = req.body; // Extract service data from the request body
    const result = await createService(serviceData, req.body.companyId);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const fetchServicesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await fetchServices(req.user.companyId as any);
    res.status(result.status).json(result); // Send the response once
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};


export const editServiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;
    const result = await editService(serviceId, updates);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteServiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const result = await deleteService(serviceId);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};
