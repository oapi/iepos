const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { exportDatabase, importDatabase } = require('./backup.controller');

router.get('/export', authenticate, requireRole('admin'), exportDatabase);
router.post('/import', authenticate, requireRole('admin'), importDatabase);

module.exports = router;
