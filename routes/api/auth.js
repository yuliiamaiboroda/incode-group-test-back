const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth');
const { authUser, validateRequestBody } = require('../../middlewares');
const { registerSchema, loginSchema } = require('../../helpers/schemas');
const { controllerExceptionWrapper } = require('../../helpers/utils');

router
  .post(
    '/register',
    validateRequestBody(registerSchema),
    controllerExceptionWrapper(AuthController.register)
  )
  .post(
    '/login',
    validateRequestBody(loginSchema),
    controllerExceptionWrapper(AuthController.login)
  )
  .use(authUser)
  .post('/logout', controllerExceptionWrapper(AuthController.logout));

module.exports = router;
