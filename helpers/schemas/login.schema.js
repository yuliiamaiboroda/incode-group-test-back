const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .pattern(/^(\w+([.-]?\w+){1,})*@\w+([.-]?\w+)*(.\w{2,3})+$/)
    .min(10)
    .max(63)
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      'string.pattern.base': 'Email must be valid',
      'string.email': 'Email must be valid',
      'string.min': 'Email must be at least 10 characters',
      'string.max': 'Email must be at most 63 characters',
      'string.empty': 'Email is required',
    }),
  password: Joi.string()
    .pattern(/^\d*(?=.*[a-z])(?=.*[A-Z])\S+\D*\d*$/)
    .min(7)
    .max(50)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at  least one lowercase letter , one uppercase letter and one number',
      'string.min': 'Password must be at least 7 characters',
      'string.max': 'Password must be at most 50 characters',
      'string.empty': 'Password is required',
    }),
});

module.exports = loginSchema;
