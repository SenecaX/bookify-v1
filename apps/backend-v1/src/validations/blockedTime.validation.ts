import Joi from 'joi';

export const blockTimeSchema = Joi.object({
  startTime: Joi.date().required().messages({
    'date.base': 'Start time must be a valid date',
    'any.required': 'Start time is required',
  }),
  endTime: Joi.date().required().greater(Joi.ref('startTime')).messages({
    'date.base': 'End time must be a valid date',
    'any.required': 'End time is required',
    'date.greater': 'End time must be later than start time',
  }),
  reason: Joi.string().optional().allow('')  // Optional field for the reason
});

export const validateBlockTimeData = (data: any) => {
  const { error } = blockTimeSchema.validate(data, { abortEarly: false });

  if (!error) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errors: error.details.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
};
