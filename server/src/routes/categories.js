const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../utils/validators');

router.use(authenticate);

router.get('/', (req, res, next) => {
  try {
    const categories = categoryService.list(req.user.id);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createCategorySchema), (req, res, next) => {
  try {
    const category = categoryService.create(req.user.id, req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateCategorySchema), (req, res, next) => {
  try {
    const category = categoryService.update(req.user.id, parseInt(req.params.id), req.body);
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    categoryService.remove(req.user.id, parseInt(req.params.id));
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
