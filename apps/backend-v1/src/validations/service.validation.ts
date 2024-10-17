import Joi from 'joi';

// Joi validation schema for creating or updating a service
export const serviceSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Service name is required',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Service description is required',
  }),
  companyId: Joi.string().optional(), // Can be added automatically by the system, not required in payload
  duration: Joi.number().required().positive().messages({
    'number.base': 'Duration must be a number',
    'number.positive': 'Duration must be a positive number',
    'any.required': 'Duration is required',
  }),
  bufferDuration: Joi.number().required().min(0).messages({
    'number.base': 'Buffer duration must be a number',
    'number.min': 'Buffer duration must be at least 0',
    'any.required': 'Buffer duration is required',
  }),
});

// Interface to define the validation response structure
interface ValidationResponse {
  isValid: boolean;
  errors?: Array<{ field: string; message: string }>;
}

// Function to validate the service data using Joi schema
export const validateServiceData = (serviceData: any): ValidationResponse => {
  const { error } = serviceSchema.validate(serviceData, { abortEarly: false });
  
  if (!error) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errors: error.details.map((err: any) => ({
      field: err.path.join('.'), // Converts array path to a string if nested
      message: err.message,
    })),
  };
};
