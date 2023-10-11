const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .pattern(/^(\w+([.-]?\w+){1,})*@\w+([.-]?\w+)*(.\w{2,3})+$/)
    .min(10)
    .max(63)
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .pattern(/^\d*(?=.*[a-z])(?=.*[A-Z])\S+\D*\d*$/)
    .min(7)
    .max(50)
    .required(),
});

module.exports = loginSchema;
