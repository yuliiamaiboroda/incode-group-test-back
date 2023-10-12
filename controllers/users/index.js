const UsersServices = require('../../services/users');

const getUsersList = async (req, res) => {
  const data = await UsersServices.getUsersList(req.user);

  res.status(200).json(data);
};

const changeBossOfUser = async (req, res) => {
  const data = await UsersServices.changeBossOfUser(req.user, req.body);

  res.status(200).json(data);
};

module.exports = {
  getUsersList,
  changeBossOfUser,
};
