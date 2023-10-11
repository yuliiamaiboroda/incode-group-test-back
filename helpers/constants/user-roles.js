// a. Administrator (top-most user)
// b. Boss (any user with at least 1 subordinate)
// c. Regular user (user without subordinates)

const ROLES_LIST = Object.freeze({
  ADMIN: 'admin',
  BOSS: 'boss',
  USER: 'user',
});

const USER_ROLES = Object.values(ROLES_LIST);

module.exports = {
  ROLES_LIST,
  USER_ROLES,
};
