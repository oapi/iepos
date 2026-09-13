const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./sales.controller');

router.get('/', authenticate, c.listSales);
router.get('/:id', authenticate, c.getSale);
router.post('/', authenticate, c.createSale);
router.post('/:id/void', authenticate, requireMinRole('manager'), c.voidSale);

module.exports = router;
