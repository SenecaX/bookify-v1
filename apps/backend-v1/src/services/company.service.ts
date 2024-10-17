import { Types } from 'mongoose';
import { ICompany } from '../models/company.model';
import { CompanyRepository } from '../repositories/company.repository';  // Import the repository
import { UserRepository } from '../repositories/user.repository';

export interface GetCompanyDataDto {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  adminId: string;  // ObjectId as string
  workingHours?: {
    day: string;     // Day of the week (e.g., 'Monday')
    isDayOn: boolean; // Whether the day is active
    start: string;  // Start time (e.g., '09:00')
    end: string;    // End time (e.g., '17:00')
    breaks?: {
      start: string;  // Break start time (e.g., '12:00')
      end: string;    // Break end time (e.g., '13:00')
    }[];
  }[];
  holidays?: {
    date: string;      // ISO string date (e.g., '2024-10-09')
    description: string;  // Description of the holiday
    category: string;  // Category of the holiday (e.g., 'national', 'religious')
  }[];
  createdAt: string;  // ISO string date
  updatedAt: string;  // ISO string date
}


const companyRepository = new CompanyRepository();
const userRepository = new UserRepository(); // Instantiate the UserRepository

// Method to create a company and update the user's companyId
export const createCompany = async (companyData: Partial<ICompany>): Promise<any> => {
  try {
    // Check if the company already exists by name
    const companyExists = await companyRepository.companyExists(companyData.name);
    if (companyExists) {
      return {
        status: 400,
        code: 'COMPANY_EXISTS',
        message: 'Company with this name already exists',
      };
    }

    // Create the company
    const company = await companyRepository.createCompany(companyData);

    // Once the company is created, update the admin user's companyId
    if (company && companyData.adminId) {
      // Convert ObjectId to string before passing it
      await userRepository.updateUser(companyData.adminId.toString(), { companyId: company._id as any });
    }

    return {
      status: 201,
      code: 'COMPANY_CREATED',
      message: 'Company created successfully, and user companyId updated',
      data: company,
    };
  } catch (error) {
    console.error('Error creating company:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to create company',
    };
  }
};

export const updateCompany = async (companyId: string, updateData: Partial<ICompany>): Promise<any> => {
  try {
    const company = await companyRepository.updateCompany(companyId, updateData);
    if (!company) {
      return {
        status: 404,
        code: 'COMPANY_NOT_FOUND',
        message: 'Company not found',
      };
    }

    return {
      status: 200,
      code: 'COMPANY_UPDATED',
      message: 'Company updated successfully',
      data: company,
    };
  } catch (error) {
    console.error('Error updating company:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to update company',
    };
  }
};

// Method to fetch a company by its name
export const getCompanyByName = async (companyName: string): Promise<{
  status: number;
  code: string;
  message: string;
  data?: GetCompanyDataDto; // Using the DTO here
}> => {
  try {
    const company = await companyRepository.findCompanyByName(companyName); // Fetch company by name
    if (!company) {
      return {
        status: 404,
        code: 'COMPANY_NOT_FOUND',
        message: 'Company not found',
      };
    }

    const companyData: GetCompanyDataDto = {
      _id: company._id.toString(),
      name: company.name,
      address: company.address,
      adminId: company.adminId.toString(),  // Assuming ObjectId to string
      workingHours: company.workingHours,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };

    return {
      status: 200,
      code: 'COMPANY_FOUND',
      message: 'Company found',
      data: companyData,
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to fetch company',
    };
  }
};
