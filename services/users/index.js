const { ROLES_LIST } = require('../../helpers/constants/user-roles');
const {
  createHttpException,
} = require('../../helpers/utils/create-http-exception');
const {
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
} = require('../../helpers/users-query');

const getUsersList = async user => {
  const usersList = {
    [ROLES_LIST.ADMIN]: await getAdminUsers(),
    [ROLES_LIST.BOSS]: await getBossUsers(user),
    [ROLES_LIST.USER]: await getUserById(user.id),
  };

  return usersList[user.role] || [];
};

const changeBossOfUser = async (currentUserData, body) => {
  const { id, subordinates, role } = currentUserData;
  const { bossId, userId } = body;

  // Forbid change user`s boss for user with role User
  await validateUserRole(role);

  // Forbid set as a boss for yourself
  await validateSelfBossChange(bossId, userId);

  const user = await getUserById(userId);

  // Forbid set subordinates as a boss
  await validateBossIsSubordinate(user.subordinates, bossId);

  // Forbid set boss for users that have ADMIN role
  await validateSettingBossForAdmin(user.role);

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

  // Forbit set as a boss user who is subordinate to your subordinate

  await validateSubordateOfSuberbordinate(newBoss.id, subordinates);

  newBoss.role === ROLES_LIST.ADMIN
    ? (newBossRole = ROLES_LIST.ADMIN)
    : (newBossRole = ROLES_LIST.BOSS);

  const oldBoss = await getUserById(user.boss);

  // Forbid change boss on the same user
  await validateSameBoss(oldBoss.id, newBoss.id);

  oldBoss.role === ROLES_LIST.ADMIN && (oldBossRole = ROLES_LIST.ADMIN);

  oldBoss.subordinates.length === 1 && oldBoss.role !== ROLES_LIST.ADMIN
    ? (oldBossRole = ROLES_LIST.USER)
    : (oldBossRole = oldBoss.role);

  const updatedOldBoss = await updateOldBoss(user.boss, oldBossRole, user.id);

  const updatedNewBoss = await updateNewBoss(bossId, newBossRole, user.id);

  const updatedUser = await updateUser(userId, newBoss.id);

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
