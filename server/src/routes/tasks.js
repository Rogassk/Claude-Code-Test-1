const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema, updateStatusSchema } = require('../utils/validators');

// All task routes require authentication
router.use(authenticate);

router.get('/', (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      search: req.query.search,
      due_before: req.query.due_before,
      due_after: req.query.due_after,
      sort: req.query.sort || 'created_at',
      order: req.query.order || 'desc',
      page: parseInt(req.query.page) || 1,
      limit: Math.min(parseInt(req.query.limit) || 20, 100),
    };
    const result = taskService.list(req.user.id, filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const task = taskService.getById(req.user.id, parseInt(req.params.id));
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createTaskSchema), (req, res, next) => {
  try {
    const task = taskService.create(req.user.id, req.body);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateTaskSchema), (req, res, next) => {
  try {
    const task = taskService.update(req.user.id, parseInt(req.params.id), req.body);
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', validate(updateStatusSchema), (req, res, next) => {
  try {
    const task = taskService.updateStatus(req.user.id, parseInt(req.params.id), req.body.status);
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    taskService.remove(req.user.id, parseInt(req.params.id));
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
