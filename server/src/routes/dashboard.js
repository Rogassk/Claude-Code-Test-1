const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', (req, res, next) => {
  try {
    const stats = dashboardService.getStats(req.user.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get('/productivity', (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const data = dashboardService.getProductivity(req.user.id, days);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
