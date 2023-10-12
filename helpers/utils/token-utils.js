const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const createAccessToken = payload =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: Number(JWT_EXPIRATION) });

const verifyToken = token => jwt.verify(token, JWT_SECRET);

module.exports = {
  createAccessToken,
  verifyToken,
};
