const bcrypt = require('bcrypt');
const config = require('../config');

async function hashPassword(password) {
  return bcrypt.hash(password, config.BCRYPT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
