const UserModel = require('../../models/');
const { ROLES_LIST } = require('../../helpers/constants/user-roles');
const { createHttpException } = require('../utils/create-http-exception');
const {
  UPDATE_DEFAULT_CONFIG,
} = require('../../helpers/constants/update-default-config');
const mongoose = require('mongoose');

const getAdminUsers = async () => {
  return await UserModel.find({}, { sessionKey: 0, passwordHash: 0 });
};

const getSubordinates = async bossId => {
  return await UserModel.find(
    { boss: bossId },
    { sessionKey: 0, passwordHash: 0 }
  );
};

const getBossUsers = async user => {
  const subordinates = await getSubordinates(user.id);

  return {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    role: user.role,
    boss: user.boss,
    email: user.email,
    subordinates,
  };
};

const getUserById = async id => {
  const user = await UserModel.findById(id, { sessionKey: 0, passwordHash: 0 });

  if (!user) throw createHttpException(404, 'Not found');

  return user;
};

const validateUserRole = async role => {
  if (role === ROLES_LIST.USER) throw createHttpException(403, 'Forbidden');
};

const validateSelfBossChange = async (bossId, userId) => {
  if (bossId === userId) throw createHttpException(403, 'Forbidden');
};

const validateBossIsSubordinate = async (subordinates, bossId) => {
  const isBossSubordinate = subordinates.includes(bossId);
  if (isBossSubordinate) throw createHttpException(403, 'Forbidden');
};

const validateSettingBossForAdmin = async role => {
  if (role === ROLES_LIST.ADMIN) throw createHttpException(403, 'Forbidden');
};

const validateSubordateOfSuberbordinate = async (
  newBossId,
  usersSubordinates
) => {
  const bossesOfNewBossArray = await UserModel.find({
    subordinates: newBossId,
  });
  const repeatedUsers = [];

  bossesOfNewBossArray.forEach(({ boss }) => {
    if (!boss) return;

    if (usersSubordinates.includes(boss.toString())) {
      repeatedUsers.push(boss);
    }
  });

  if (repeatedUsers.length > 0)
    throw createHttpException(
      403,
      "Forbidden. a subordinate of a subordinate user cannot be the user's boss"
    );
};

const validateSameBoss = async (oldbossId, newBossId) => {
  if (oldbossId.toString() === newBossId.toString())
    throw createHttpException(
      400,
      'This user is already boss for current user'
    );
};

const updateOldBoss = async (oldBossId, oldBossRole, userId) => {
  return await UserModel.findByIdAndUpdate(
    oldBossId,
    {
      role: oldBossRole,
      $pull: { subordinates: new mongoose.Types.ObjectId(userId) },
    },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );
};

const updateNewBoss = async (newBossId, newBossRole, userId) => {
  return await UserModel.findByIdAndUpdate(
    newBossId,
    {
      role: newBossRole,
      $push: { subordinates: new mongoose.Types.ObjectId(userId) },
    },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );
};

const updateUser = async (userId, newBossId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { boss: new mongoose.Types.ObjectId(newBossId) },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );
};

module.exports = {
  getAdminUsers,
  getBossUsers,
  getUserById,
  validateUserRole,
  validateSelfBossChange,
  validateBossIsSubordinate,
  validateSettingBossForAdmin,
  validateSubordateOfSuberbordinate,
  validateSameBoss,
  updateOldBoss,
  updateNewBoss,
  updateUser,
};
