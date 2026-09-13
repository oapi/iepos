const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./inventory.controller');

router.get('/movements', authenticate, c.listStockMovements);
router.get('/low-stock', authenticate, c.getLowStockProducts);
router.get('/summary', authenticate, c.getStockSummary);
router.post('/adjust', authenticate, requireMinRole('manager'), c.adjustStock);

module.exports = router;
