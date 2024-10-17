import { IService } from '../models/service.model';
import { ServiceRepository } from '../repositories/service.repository';
import { validateServiceData } from '../validations/service.validation';
import { Types } from 'mongoose';

const serviceRepository = new ServiceRepository();

// Fetch services by companyId
export const fetchServices = async (companyId: string | Types.ObjectId): Promise<any> => {
  try {
    // Ensure companyId is not undefined
    if (!companyId) {
      return {
        status: 400,
        code: 'COMPANY_ID_MISSING',
        message: 'Company ID is missing.',
      };
    }

    // Fetch services by companyId
    const services = await serviceRepository.fetchServicesByCompany(companyId.toString());
    return {
      status: 200,
      code: 'SERVICES_FETCHED',
      message: 'Services fetched successfully',
      data: services,
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to fetch services',
    };
  }
};


// Create a new service
export const createService = async (serviceData: IService, companyId: string): Promise<any> => {
  const validation = validateServiceData(serviceData);
  if (!validation.isValid) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: validation.errors,
    };
  }

  try {
    const newService = await serviceRepository.createService({
      ...serviceData,
      companyId: new Types.ObjectId(companyId),
    });

    return {
      status: 201,
      code: 'SERVICE_CREATED',
      message: 'Service created successfully',
      data: newService,
    };
  } catch (error) {
    console.error('Error creating service:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to create service',
    };
  }
};

// Edit an existing service
export const editService = async (serviceId: string, updates: Partial<IService>): Promise<any> => {
  try {
    const updatedService = await serviceRepository.updateService(serviceId, updates);
    if (!updatedService) {
      return {
        status: 404,
        code: 'SERVICE_NOT_FOUND',
        message: 'Service not found',
      };
    }

    return {
      status: 200,
      code: 'SERVICE_UPDATED',
      message: 'Service updated successfully',
      data: updatedService,
    };
  } catch (error) {
    console.error('Error updating service:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to update service',
    };
  }
};

// Delete a service
export const deleteService = async (serviceId: string): Promise<any> => {
  try {
    const service = await serviceRepository.deleteService(serviceId);
    if (!service) {
      return {
        status: 404,
        code: 'SERVICE_NOT_FOUND',
        message: 'Service not found',
      };
    }

    return {
      status: 200,
      code: 'SERVICE_DELETED',
      message: 'Service deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Unable to delete service',
    };
  }
};
