const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./suppliers.controller');

router.get('/', authenticate, c.listSuppliers);
router.get('/:id', authenticate, c.getSupplier);
router.get('/:id/ledger', authenticate, c.getSupplierLedger);
router.post('/', authenticate, c.createSupplier);
router.put('/:id', authenticate, c.updateSupplier);
router.delete('/:id', authenticate, requireMinRole('manager'), c.deleteSupplier);

module.exports = router;
