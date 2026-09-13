const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./categories.controller');

router.get('/', authenticate, c.listCategories);
router.post('/', authenticate, requireMinRole('manager'), c.createCategory);
router.put('/:id', authenticate, requireMinRole('manager'), c.updateCategory);
router.delete('/:id', authenticate, requireMinRole('admin'), c.deleteCategory);

module.exports = router;
