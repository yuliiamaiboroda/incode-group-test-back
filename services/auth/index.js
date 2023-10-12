const { createAccessToken } = require('../../helpers/utils');
const {
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
} = require('../../helpers/auth-query');

const register = async body => {
  const { name, surname, email, password } = body;
  await validateRepeatedEmail(email);

  const { role, boss } = await determineRoleAndBoss();

  const sessionKey = generateSessionKey();

  const passwordHash = await hashPassword(password);

  const newUser = await createNewUser({
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

  // Every user with a role other than admin must have a boss. An administrator is appointed upon registration

  await updateBossSubordinates(newUser);

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

  const user = await findUserByEmail(email);

  await validateUserCredentials(password, user.passwordHash);

  // To protect against repeating sessionKey

  const sessionKey = await generateUniqueSessionKey(user.sessionKey);

  const accessToken = createAccessToken({
    userId: user._id,
    sessionKey,
  });

  await updateSessionKey(user._id, sessionKey);

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
  await updateSessionKey(id, null);
};

const getCurrentUser = async user => {
  const { _id, name, surname, email, role, boss, subordinates } = user;
  return {
    _id,
    name,
    surname,
    email,
    role,
    boss,
    subordinates,
  };
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
