const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./accounts.controller');

router.get('/', authenticate, c.listAccounts);
router.get('/:id', authenticate, c.getAccount);
router.get('/:id/statement', authenticate, c.getStatement);
router.post('/', authenticate, requireMinRole('manager'), c.createAccount);
router.put('/:id', authenticate, requireMinRole('manager'), c.updateAccount);
router.post('/:id/deposit', authenticate, requireMinRole('manager'), c.deposit);
router.post('/:id/withdraw', authenticate, requireMinRole('manager'), c.withdraw);
router.post('/:id/transfer', authenticate, requireMinRole('manager'), c.transfer);

module.exports = router;
