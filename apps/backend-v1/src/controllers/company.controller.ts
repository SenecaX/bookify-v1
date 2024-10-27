import { Response, NextFunction } from 'express';
import { createCompany, getCompanyByName, updateCompany } from '../services/company.service';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

// Controller to create a company
export const createCompanyController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const companyData = req.body;
    const result = await createCompany(companyData);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateCompanyController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateCompany(id, updateData);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCompanyByNameController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.params; // Get the company name from the URL params
    const result = await getCompanyByName(name);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};