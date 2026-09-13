const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./expenses.controller');

router.get('/categories', authenticate, c.listExpenseCategories);
router.get('/', authenticate, c.listExpenses);
router.post('/', authenticate, c.createExpense);
router.put('/:id', authenticate, requireMinRole('manager'), c.updateExpense);

module.exports = router;
