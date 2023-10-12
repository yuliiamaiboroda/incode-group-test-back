const UserModel = require('../../models/');
const { ROLES_LIST } = require('../../helpers/constants/user-roles');
const {
  createHttpException,
} = require('../../helpers/utils/create-http-exception');
const { getSubordinates, getUserById } = require('../../helpers/users-query');
const {
  UPDATE_DEFAULT_CONFIG,
} = require('../../helpers/constants/update-default-config');

const getUsersList = async user => {
  const { role, id } = user;

  switch (role) {
    case ROLES_LIST.ADMIN:
      return await UserModel.find({}, { sessionKey: 0, passwordHash: 0 });

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

const changeBossOfUser = async (currentUserData, body) => {
  const { id, subordinates, role } = currentUserData;
  const { bossId, userId } = body;

  // Forbid change user`s boss for user with role User
  if (role === ROLES_LIST.USER) throw createHttpException(403, 'Forbidden');

  // Forbid set as a boss for yourself
  if (bossId === userId) throw createHttpException(403, 'Forbidden');

  const user = await getUserById(userId);

  if (!user) throw createHttpException(404, 'Not found');

  // Forbid set subordinates as a boss
  const isBossSubordinate = user.subordinates.includes(bossId);
  if (isBossSubordinate) throw createHttpException(403, 'Forbidden');

  // Forbid set boss for users that have ADMIN role
  if (user.role === ROLES_LIST.ADMIN)
    throw createHttpException(403, 'Forbidden');

  const isUserSubordinate = subordinates.includes(userId);
  const isCurrenUserBoss = id === user.boss.toString();

  // Forbid change boss in cases when user is not your subordinate or you dont have ADMIN role
  if ((!isUserSubordinate || !isCurrenUserBoss) && role !== ROLES_LIST.ADMIN) {
    throw createHttpException(403, 'Forbidden');
  }

  let newBossRole;
  let oldBossRole;

  const newBoss = await getUserById(bossId);

  if (!newBoss) throw createHttpException(404, 'Not found');

  newBoss.role === ROLES_LIST.ADMIN
    ? (newBossRole = ROLES_LIST.ADMIN)
    : (newBossRole = ROLES_LIST.BOSS);

  const oldBoss = await getUserById(user.boss);

  if (!oldBoss) throw createHttpException(404, 'Not found');

  // Forbid change boss on the same user
  if (oldBoss.id.toString() === newBoss.id.toString())
    throw createHttpException(
      400,
      'This user is already boss for current user'
    );

  oldBoss.role === ROLES_LIST.ADMIN && (oldBossRole = ROLES_LIST.ADMIN);

  oldBoss.subordinates.length === 1 && oldBoss.role !== ROLES_LIST.ADMIN
    ? (oldBossRole = ROLES_LIST.USER)
    : (oldBossRole = oldBoss.role);

  const updatedOldBoss = await UserModel.findByIdAndUpdate(
    user.boss,
    {
      role: oldBossRole,
      $pull: { subordinates: user.id },
    },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );

  const updatedNewBoss = await UserModel.findByIdAndUpdate(
    bossId,
    {
      role: newBossRole,
      $push: { subordinates: user.id },
    },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { boss: newBoss.id },
    { ...UPDATE_DEFAULT_CONFIG, projection: { passwordHash: 0, sessionKey: 0 } }
  );

  return {
    updatedOldBoss,
    updatedNewBoss,
    updatedUser,
  };
};

module.exports = {
  getUsersList,
  changeBossOfUser,
};
