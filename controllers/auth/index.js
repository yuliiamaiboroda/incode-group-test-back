const AuthServices = require('../../services/auth');

const register = async (req, res, next) => {
  const data = await AuthServices.register(req.body);

  res.status(201).json(data);
};

const login = async (req, res, next) => {
  const data = await AuthServices.login(req.body);

  res.status(200).json(data);
};

const logout = async (req, res, next) => {
  await AuthServices.logout(req.user.id);

  res.status(204).send();
};

const getCurrentUser = async (req, res, next) => {
  const data = await AuthServices.getCurrentUser(req.user);

  res.status(200).json(data);
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
