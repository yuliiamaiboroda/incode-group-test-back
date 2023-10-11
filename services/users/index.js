const UserModel = require('../../models/');
const { ROLES_LIST } = require('../../helpers/constants/user-roles');
const {
  createHttpException,
} = require('../../helpers/utils/create-http-exception');
const { getSubordinates } = require('../../helpers/users-query');

const getUsersList = async user => {
  const { role, id } = user;

  switch (role) {
    case ROLES_LIST.ADMIN:
      return await UserModel.find();

    case ROLES_LIST.BOSS:
      const subordinates = await getSubordinates(id);
      const bossInfo = {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        boss: user.boss,
        email: user.email,
        subordinates: subordinates,
      };
      return bossInfo;

    case ROLES_LIST.USER:
      return await getUserById(id);

    default:
      return [];
  }
};

module.exports = {
  getUsersList,
};
