import { ICompany, Company } from '../models/company.model';  // Import the company model

export class CompanyRepository {
  // Method to create a company
  async createCompany(companyData: Partial<ICompany>): Promise<ICompany> {
    const company = new Company(companyData);
    return await company.save();
  }

  // Method to find a company by name
  async findCompanyByName(name: string): Promise<ICompany | null> {
    return await Company.findOne({ name });
  }

  // Method to check if company exists by name
  async companyExists(name: string): Promise<boolean> {
    const company = await Company.findOne({ name });
    return !!company;  // Returns true if a company is found, false otherwise
  }

  // Method to update a company
  async updateCompany(companyId: string, updateData: Partial<ICompany>): Promise<ICompany | null> {
    try {
      console.log('updateCompanyRepository called', updateData);
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { $set: { workingHours: updateData.workingHours, adminId: updateData.adminId } }, // Correct field mapping
        { new: true }
      );
      if (!updatedCompany) {
        throw new Error('Company not found');
      }
      return updatedCompany;
    } catch (error) {
      console.error('Error updating company:', error);
      throw new Error('Failed to update company');
    }
  }
  
  
  
}
