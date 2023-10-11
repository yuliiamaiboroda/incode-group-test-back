const {
  createHttpException,
} = require('../helpers/utils/create-http-exception');
const UserModel = require('../models/user-model');
const { verifyToken } = require('../services/token-check');

const authUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw createHttpException(401, 'Unauthorized');
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw createHttpException(401, 'Unauthorized');
    }
    try {
      const { userId, sessionKey } = verifyToken(token);

      const userInstanse = await UserModel.findById(userId);

      if (!userInstanse || !userInstanse.sessionKey) {
        throw createHttpException(401, 'Unauthorized');
      }
      if (sessionKey !== userInstanse.sessionKey) {
        throw createHttpException(401, 'Unauthorized');
      }
      req.user = userInstanse;
      next();
    } catch (error) {
      throw createHttpException(401, 'Unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
