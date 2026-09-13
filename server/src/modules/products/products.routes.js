const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { requireMinRole } = require('../../middleware/rbac');
const c = require('./products.controller');

router.get('/search', authenticate, c.searchProducts);
router.get('/', authenticate, c.listProducts);
router.get('/:id', authenticate, c.getProduct);
router.post('/', authenticate, requireMinRole('manager'), c.createProduct);
router.put('/:id', authenticate, requireMinRole('manager'), c.updateProduct);
router.delete('/:id', authenticate, requireMinRole('manager'), c.deleteProduct);

module.exports = router;
