const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { generateAccessToken, verifyAccessToken, generateRefreshToken, hashToken };
