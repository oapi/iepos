const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { listUsers, getUser, createUser, updateUser, resetPassword } = require('./users.controller');

const adminOnly = [authenticate, requireRole('admin')];

router.get('/', ...adminOnly, listUsers);
router.get('/:id', ...adminOnly, getUser);
router.post('/', ...adminOnly, createUser);
router.put('/:id', ...adminOnly, updateUser);
router.post('/:id/reset-password', ...adminOnly, resetPassword);

module.exports = router;
