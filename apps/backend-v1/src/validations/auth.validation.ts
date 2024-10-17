import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    zip: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  role: Joi.string().valid('admin', 'provider', 'customer').required(),
  companyId: Joi.string().optional(),
});
