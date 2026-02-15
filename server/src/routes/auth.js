const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter, strictAuthLimiter } = require('../middleware/rateLimiter');
const {
  signupSchema, loginSchema, forgotPasswordSchema,
  resetPasswordSchema, refreshTokenSchema,
} = require('../utils/validators');

router.post('/signup', strictAuthLimiter, validate(signupSchema), async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, (req, res, next) => {
  try {
    authService.logout(req.body.refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', validate(refreshTokenSchema), (req, res, next) => {
  try {
    const result = authService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', strictAuthLimiter, validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, (req, res, next) => {
  try {
    const user = authService.getProfile(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
