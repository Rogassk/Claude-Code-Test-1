const crypto = require('crypto');
const { getDb } = require('../database/connection');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, hashToken } = require('../utils/jwt');
const config = require('../config');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function signup({ name, email, password }) {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw createError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(password);
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
  ).run(email, passwordHash, name);

  const user = { id: result.lastInsertRowid, name, email };
  const tokens = createTokens(db, user);

  return { user, ...tokens };
}

async function login({ email, password }) {
  const db = getDb();

  const user = db.prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?').get(email);
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw createError('Invalid email or password', 401);
  }

  const userData = { id: user.id, name: user.name, email: user.email };
  const tokens = createTokens(db, userData);

  return { user: userData, ...tokens };
}

function refresh(refreshToken) {
  const db = getDb();
  const tokenHash = hashToken(refreshToken);

  const stored = db.prepare(
    'SELECT id, user_id, expires_at FROM refresh_tokens WHERE token_hash = ?'
  ).get(tokenHash);

  if (!stored) {
    throw createError('Invalid refresh token', 401);
  }

  if (new Date(stored.expires_at) < new Date()) {
    db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(stored.id);
    throw createError('Refresh token expired', 401);
  }

  // Delete old token (rotation)
  db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(stored.id);

  const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(stored.user_id);
  if (!user) {
    throw createError('User not found', 401);
  }

  const tokens = createTokens(db, user);
  return { user, ...tokens };
}

function logout(refreshToken) {
  if (!refreshToken) return;
  const db = getDb();
  const tokenHash = hashToken(refreshToken);
  db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(tokenHash);
}

async function forgotPassword(email) {
  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

  // Always return success to prevent email enumeration
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  db.prepare(
    'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?'
  ).run(tokenHash, expires, user.id);

  // In production, you'd send an email here
  console.log(`\n=== PASSWORD RESET LINK ===`);
  console.log(`http://localhost:5173/reset-password/${token}`);
  console.log(`========================\n`);
}

async function resetPassword({ token, password }) {
  const db = getDb();
  const tokenHash = hashToken(token);

  const user = db.prepare(
    'SELECT id, password_reset_expires FROM users WHERE password_reset_token = ?'
  ).get(tokenHash);

  if (!user) {
    throw createError('Invalid or expired reset token', 400);
  }

  if (new Date(user.password_reset_expires) < new Date()) {
    throw createError('Reset token has expired', 400);
  }

  const passwordHash = await hashPassword(password);

  db.prepare(
    'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(passwordHash, user.id);

  // Invalidate all refresh tokens for this user
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(user.id);
}

function getProfile(userId) {
  const db = getDb();
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId);
  if (!user) {
    throw createError('User not found', 404);
  }
  return user;
}

// Helper to create both tokens
function createTokens(db, user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRY_DAYS * 86400000).toISOString();

  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ).run(user.id, tokenHash, expiresAt);

  return { accessToken, refreshToken };
}

module.exports = { signup, login, refresh, logout, forgotPassword, resetPassword, getProfile };
