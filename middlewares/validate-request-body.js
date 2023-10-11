const { createHttpException } = require('../helpers/utils');

const validateRequestBody = schema => {
  const fn = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createHttpException(400, error.message));
    }

    next();
  };

  return fn;
};

module.exports = {
  validateRequestBody,
};
