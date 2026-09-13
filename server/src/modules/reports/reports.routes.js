const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./reports.controller');

router.get('/dashboard', authenticate, c.getDashboard);
router.get('/profit-loss', authenticate, requireMinRole('manager'), c.getProfitLoss);
router.get('/sales', authenticate, c.getSalesReport);
router.get('/purchases', authenticate, requireMinRole('manager'), c.getPurchaseReport);

module.exports = router;
