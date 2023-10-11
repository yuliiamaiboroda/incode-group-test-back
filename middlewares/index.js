const { authUser } = require('./auth-user.middleware');
const { globalErrorHandler } = require('./global-error-handler.middleware');
const { validateRequestBody } = require('./validate-request-body');

module.exports = {
  globalErrorHandler,
  authUser,
  validateRequestBody,
};
