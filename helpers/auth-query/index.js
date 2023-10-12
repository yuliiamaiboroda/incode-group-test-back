const crypto = require('crypto');
const bcrypt = require('bcrypt');
const UserModel = require('../../models');
const {
  ROLES_LIST,
  UPDATE_DEFAULT_CONFIG,
} = require('../../helpers/constants');
const { createHttpException } = require('../utils/create-http-exception');

const validateRepeatedEmail = async email => {
  const userWithCurrentEmail = await UserModel.findOne({ email });

  if (userWithCurrentEmail) throw createHttpException(409, 'Email in use');
};

const determineRoleAndBoss = async () => {
  let role;
  let boss;

  const usersList = await UserModel.find();

  const adminUserInList = usersList.find(
    user => user.role === ROLES_LIST.ADMIN
  );

  if (usersList.length === 0 && !adminUserInList) {
    role = ROLES_LIST.ADMIN;
    boss = null;
  } else {
    const adminUser = await UserModel.findOne({ role: ROLES_LIST.ADMIN });

    role = ROLES_LIST.USER;
    boss = adminUser ? adminUser._id : null;
  }

  return { role, boss };
};

const generateSessionKey = () => {
  return crypto.randomUUID();
};

const hashPassword = async password => {
  return await bcrypt.hash(password, 10);
};

const createNewUser = async ({
  name,
  surname,
  role,
  boss,
  email,
  passwordHash,
  sessionKey,
}) => {
  return await UserModel.create({
    name,
    surname,
    role,
    boss,
    email,
    passwordHash,
    sessionKey,
  });
};

const updateBossSubordinates = async newUser => {
  if (newUser.role !== ROLES_LIST.ADMIN) {
    await UserModel.findByIdAndUpdate(
      newUser.boss,
      { $push: { subordinates: newUser } },
      UPDATE_DEFAULT_CONFIG
    );
  }
};

const findUserByEmail = async email => {
  const user = await UserModel.findOne({ email });

  if (!user) throw createHttpException(401, 'Unauthorized');

  return user;
};

const validateUserCredentials = async (password, passwordHasFromDB) => {
  const isValidPassword = await bcrypt.compare(password, passwordHasFromDB);

  if (!isValidPassword) throw createHttpException(401, 'Unauthorized');
};

const generateUniqueSessionKey = async existingSessionKey => {
  let sessionKey;

  do {
    sessionKey = crypto.randomUUID();
  } while (sessionKey === existingSessionKey);

  return sessionKey;
};

const updateSessionKey = async (id, sessionKey) => {
  await UserModel.findByIdAndUpdate(
    id,
    { sessionKey: sessionKey },
    UPDATE_DEFAULT_CONFIG
  );
};

module.exports = {
  validateRepeatedEmail,
  determineRoleAndBoss,
  generateSessionKey,
  hashPassword,
  createNewUser,
  updateBossSubordinates,
  findUserByEmail,
  generateUniqueSessionKey,
  validateUserCredentials,
  updateSessionKey,
};
