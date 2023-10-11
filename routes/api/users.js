const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users');
const { authUser, validateRequestBody } = require('../../middlewares');
const { controllerExceptionWrapper } = require('../../helpers/utils');

router
  .use(authUser)
  .get('/', controllerExceptionWrapper(UserController.getUsersList));

module.exports = router;
