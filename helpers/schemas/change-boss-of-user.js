const Joi = require('joi');

const ChangeBossOfUserSchema = Joi.object({
  bossId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = ChangeBossOfUserSchema;
