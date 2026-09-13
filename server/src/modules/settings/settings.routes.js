const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./settings.controller');

router.get('/', authenticate, c.getSettings);
router.put('/', authenticate, requireMinRole('admin'), c.updateSettings);

module.exports = router;
