import { IService, Service } from '../models/service.model';

export class ServiceRepository {
  async createService(serviceData: Partial<IService>): Promise<IService> {
    const service = new Service(serviceData);
    return await service.save();
  }

  async findServiceById(serviceId: string): Promise<IService | null> {
    return await Service.findById(serviceId).exec();
  }

  async fetchServicesByCompany(companyId: string): Promise<IService[]> {
    return Service.find({ companyId }).exec(); // Find services by companyId
  }

  async updateService(serviceId: string, updates: Partial<IService>): Promise<IService | null> {
    return await Service.findByIdAndUpdate(serviceId, updates, { new: true }).exec();
  }

  async deleteService(serviceId: string): Promise<IService | null> {
    return await Service.findByIdAndDelete(serviceId).exec();
  }
}
