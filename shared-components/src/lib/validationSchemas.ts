import * as Yup from 'yup';

const emailSchema = Yup.string()
  .email('Invalid email format')
  .required('Email is required');
const passwordSchema = Yup.string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');
const nameSchema = Yup.string().required('Name is required');
const phoneSchema = Yup.string()
  .matches(/^[0-9]{10}$/, 'Invalid phone number')
  .nullable()
  .transform((value, originalValue) => (originalValue === '' ? null : value))
  .test(
    'required-or-null',
    'Phone number is required',
    (value) => value !== null,
  );

// Public website
export const loginValidationSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export const registerValidationSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  termsAgreed: Yup.bool().oneOf(
    [true],
    'You must agree to the terms and conditions',
  ),
});

export const profileValidationSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Landing page website
export const registerCompanyValidationSchema = Yup.object().shape({
  companyLogin: Yup.string()
    .required('Company login is required')
    .min(3, 'Company login must be at least 3 characters long'),
  workPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Work phone is required'),
  businessCategory: Yup.string().required('Please select a business category'),
});

export const addressValidationSchema = Yup.object().shape({
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]{5}$/, 'Invalid ZIP Code')
    .required('ZIP Code is required'),
  streetAddress: Yup.string().required('Street Address is required'),
});

export const registerCompanyCredentialsValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  termsAgreed: Yup.bool()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required(),
});

// Define validation for working hours
export const workingHoursSchema = Yup.object().shape({
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});

// Define validation for breaks
export const breakSchema_old = Yup.object().shape({
  id: Yup.string().required('Break id is required'),
  startTime: Yup.string().required('Break start time is required'),
  endTime: Yup.string().required('Break end time is required'),
});

// Define validation for each day
export const dayScheduleValidationSchema = Yup.object().shape({
  days: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string().required('Day is required'),
        isActive: Yup.boolean().required(),
        workingHours: workingHoursSchema,
        breaks: Yup.array().of(breakSchema_old).required().default([]),
      }),
    )
    .required('Days are required'),
});

export const serviceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Service name is required'),
  description: Yup.string().required('Description is required'),
  displayOnBookingPage: Yup.boolean()
    .required('Display on Booking Page is required')
    .default(false),
  duration: Yup.number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 minute'), // Add validation for duration
});

export const dashboardProviderValidationSchema = Yup.object({
  name: Yup.string()
    .required('Provider Name is required')
    .min(3, 'Provider Name must be at least 3 characters')
    .max(50, 'Provider Name must be less than 50 characters'),
  description: Yup.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(), // Optional field
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
    .required('Phone number is required'), // Optional field
  email: Yup.string().email('Email is not valid').required('Email is required'), // Required field
  maxClients: Yup.number()
    .required('Max Clients is required')
    .positive('Max Clients must be a positive number'),
  displayOnBookingPage: Yup.boolean().optional(), // Optional field
});

export const dashboardServiceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Service Name is required'),
  description: Yup.string()
    .nullable() // Allow nullable description
    .required('Service Description is required'),
  displayOnBookingPage: Yup.bool().required(
    'Please indicate if the service should be displayed on the booking page',
  ),
});

/////////////////////// NEW VERSION ///////////////////////

export const customerRegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Minimum length is 8 characters'),
});

export const adminRegistrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),

  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one letter and one number',
    ),
    companyId: Yup.string().optional()
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const providerSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Must be a valid email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Must be a valid email address')
    .required('Email is required'),

  password: Yup.string().when('$isEditMode', {
    is: false,
    then: (schema) =>
      schema
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
    .notRequired(),

  address: Yup.object()
    .shape({
      street: Yup.string().notRequired(),
      city: Yup.string().notRequired(),
      zip: Yup.string().notRequired(),
      country: Yup.string().notRequired(),
    })
    .notRequired(),

  // Role is required when the form is on UsersPage
  role: Yup.string().when('$isUsersPage', {
    is: true,
    then: (schema) => schema.required('Role is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const companyRegistrationSchema = Yup.object({
  name: Yup.string().required('Company name is required'),
  address: Yup.object({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    zip: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
  }),
  category: Yup.string()
    .oneOf(
      ['technology', 'retail', 'healthcare', 'finance', 'service'],
      'Invalid category selection',
    )
    .required('Category is required'),
});

const breakSchema = Yup.object().shape({
  start: Yup.string()
    .required('Break Start Time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  end: Yup.string()
    .required('Break End Time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
    .test(
      'is-greater',
      'Break End Time must be later than Break Start Time',
      function (value) {
        const { start } = this.parent;
        if (start && value) {
          return start < value;
        }
        return true;
      },
    ),
});

const workingHourSchema = Yup.object().shape({
  day: Yup.string().required('Day is required'),
  isDayOn: Yup.boolean(),

  start: Yup.string().when('isDayOn', {
    is: true,
    then: (schema) =>
      schema
        .required('Start Time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    otherwise: (schema) => schema.notRequired(),
  }),

  end: Yup.string().when('isDayOn', {
    is: true,
    then: (schema) =>
      schema
        .required('End Time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
        .test(
          'is-greater',
          'End Time must be later than Start Time',
          function (value) {
            const { start } = this.parent;
            if (start && value) {
              return start < value;
            }
            return true;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  breaks: Yup.array().of(breakSchema).notRequired(),
});

export const companyHoursSetupSchema = Yup.object().shape({
  workingHours: Yup.array()
    .of(workingHourSchema)
    .required('Working Hours are required')
    .min(1, 'At least one working hour entry is required'),
});

export const serviceSchema = Yup.object({
  name: Yup.string()
    .required('Service name is required')
    .max(100, 'Service name must be less than 100 characters'),

  description: Yup.string()
    .required('Description is required')
    .max(500, 'Description must be less than 500 characters'),
  duration: Yup.number()
    .required('Duration is required')
    .positive('Duration must be positive'),
  bufferDuration: Yup.number()
    .required('Buffer duration is required')
    .min(0, 'Buffer duration must be at least 0'),

});
