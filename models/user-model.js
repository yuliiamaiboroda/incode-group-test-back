const mongoose = require('mongoose');
const { USER_ROLES } = require('../helpers/constants/user-roles');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: USER_ROLES,
    default: USER_ROLES.USER,
  },
  subordinates: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
  ],
  boss: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  sessionKey: {
    type: String,
    default: null,
    trim: true,
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
