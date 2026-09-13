const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const c = require('./payments.controller');

// Customer payments
router.get('/customers', authenticate, c.listCustomerPayments);
router.post('/customers', authenticate, c.createCustomerPayment);

// Supplier payments
router.get('/suppliers', authenticate, c.listSupplierPayments);
router.post('/suppliers', authenticate, c.createSupplierPayment);

module.exports = router;
