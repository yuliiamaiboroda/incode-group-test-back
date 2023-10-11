const UserModel = require('../../models/');

const getSubordinates = async bossId => {
  return await UserModel.find(
    { boss: bossId },
    { sessionKey: 0, passwordHash: 0 }
  );
};

const getUserById = async id => {
  return await UserModel.findById(id, { sessionKey: 0, passwordHash: 0 });
};

module.exports = {
  getSubordinates,
  getUserById,
};
