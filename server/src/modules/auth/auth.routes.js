const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { login, logout, me, changePassword } = require('./auth.controller');

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
