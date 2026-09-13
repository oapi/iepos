const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./purchases.controller');

router.get('/', authenticate, c.listPurchases);
router.get('/:id', authenticate, c.getPurchase);
router.post('/', authenticate, requireMinRole('manager'), c.createPurchase);

module.exports = router;
