const Joi = require('joi');

const ChangeBossOfUserSchema = Joi.object({
  bossId: Joi.string().required().messages({
    'string.empty': 'Boss id is required',
  }),
  userId: Joi.string().required().messages({
    'string.empty': 'User id is required',
  }),
});

module.exports = ChangeBossOfUserSchema;
