const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users');
const { authUser, validateRequestBody } = require('../../middlewares');
const { controllerExceptionWrapper } = require('../../helpers/utils');
const { ChangeBossOfUserSchema } = require('../../helpers/schemas');

router
  .use(authUser)
  .get('/', controllerExceptionWrapper(UserController.getUsersList))
  .post(
    '/',
    validateRequestBody(ChangeBossOfUserSchema),
    controllerExceptionWrapper(UserController.changeBossOfUser)
  );

module.exports = router;
