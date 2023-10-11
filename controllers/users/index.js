const UsersServices = require('../../services/users');

const getUsersList = async (req, res, next) => {
  const data = await UsersServices.getUsersList(req.user);

  res.status(200).json(data);
};

module.exports = {
  getUsersList,
};
