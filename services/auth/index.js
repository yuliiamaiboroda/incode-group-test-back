const crypto = require('crypto');
const bcrypt = require('bcrypt');
const UserModel = require('../../models/user-model');
const { ROLES_LIST } = require('../../helpers/constants/user-roles');
const { createAccessToken } = require('../token-check');
const {
  createHttpException,
} = require('../../helpers/utils/create-http-exception');
const {
  UPDATE_DEFAULT_CONFIG,
} = require('../../helpers/constants/update-default-config');

const register = async body => {
  const { name, surname, email, password } = body;

  const userWithCurrentEmail = await UserModel.findOne({ email });

  if (userWithCurrentEmail) throw createHttpException(409, 'Email in use');

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

  const sessionKey = crypto.randomUUID();

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name,
    surname,
    role,
    boss,
    email,
    passwordHash,
    sessionKey,
  });

  const accessToken = createAccessToken({
    userId: newUser._id,
    sessionKey: newUser.sessionKey,
  });

  //Every user with a role other than admin must have a boss. An administrator is appointed upon registration

  if (newUser.role !== ROLES_LIST.ADMIN) {
    await UserModel.findByIdAndUpdate(
      newUser.boss,
      { $push: { subordinates: newUser } },
      UPDATE_DEFAULT_CONFIG
    );
  }

  return {
    accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      surname: newUser.surname,
      email: newUser.email,
      role: newUser.role,
      boss: newUser.boss,
      subordinates: newUser.subordinates,
    },
  };
};

const login = async body => {
  const { email, password } = body;

  const user = await UserModel.findOne({ email });

  if (!user) throw createHttpException(401, 'Unauthorized');

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) throw createHttpException(401, 'Unauthorized');

  let sessionKey;

  // To protect against repeating sessionKey
  do {
    sessionKey = crypto.randomUUID();
  } while (sessionKey === user.sessionKey);

  const accessToken = createAccessToken({
    userId: user._id,
    sessionKey,
  });

  await UserModel.findByIdAndUpdate(
    user._id,
    { sessionKey },
    UPDATE_DEFAULT_CONFIG
  );

  return {
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      boss: user.boss,
      subordinates: user.subordinates,
    },
  };
};

const logout = async id => {
  await UserModel.findByIdAndUpdate(
    id,
    { sessionKey: null },
    UPDATE_DEFAULT_CONFIG
  );
};

module.exports = {
  register,
  login,
  logout,
};
