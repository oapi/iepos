const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./customers.controller');

router.get('/', authenticate, c.listCustomers);
router.get('/:id', authenticate, c.getCustomer);
router.get('/:id/ledger', authenticate, c.getCustomerLedger);
router.post('/', authenticate, c.createCustomer);
router.put('/:id', authenticate, c.updateCustomer);
router.delete('/:id', authenticate, requireMinRole('manager'), c.deleteCustomer);

module.exports = router;
