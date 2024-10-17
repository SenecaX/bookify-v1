import Joi from 'joi';

// Joi validation schema for registering a user
export const registerUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  role: Joi.string().valid('admin', 'provider', 'customer').default('provider').messages({
    'any.only': 'Role must be either admin, provider, or customer',
  }),
  companyId: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional().allow(''), // Allow empty strings
    city: Joi.string().optional().allow(''),
    zip: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
  }).optional().allow(null, {}),  // Allow empty objects and null for address
  // Add any other user-specific fields here
});

// Interface to define the validation response structure
interface ValidationResponse {
  isValid: boolean;
  errors?: Array<{ field: string; message: string }>;
}

// Function to validate the user data using Joi schema
export const validateUserData = (userData: any): ValidationResponse => {
  const { error } = registerUserSchema.validate(userData, { abortEarly: false });
  
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
