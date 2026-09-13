const { query } = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const listProducts = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { search, category_id, low_stock } = req.query;

    const conditions = ['p.is_active = true'];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length} OR p.brand ILIKE $${params.length})`);
    }
    if (category_id) {
      params.push(category_id);
      conditions.push(`p.category_id = $${params.length}`);
    }
    if (low_stock === 'true') {
      conditions.push(`p.current_stock <= p.low_stock_alert`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT p.*, c.name AS category_name, c.name_bn AS category_name_bn
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.name
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      products: rows,
      total: parseInt(countRes.rows[0].count),
      page,
      limit,
    });
  } catch (err) { next(err); }
};

const getProduct = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (err) { next(err); }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      category_id, sku, name, name_bn, brand, size, unit,
      retail_price, wholesale_price, purchase_cost,
      current_stock, low_stock_alert, notes,
    } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ error: 'name and unit are required' });
    }

    const { rows } = await query(
      `INSERT INTO products
         (category_id, sku, name, name_bn, brand, size, unit,
          retail_price, wholesale_price, purchase_cost,
          current_stock, low_stock_alert, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        category_id || null, sku || null, name, name_bn || null,
        brand || null, size || null, unit,
        retail_price || 0, wholesale_price || 0, purchase_cost || 0,
        current_stock || 0, low_stock_alert || 5, notes || null,
      ]
    );

    // If opening stock > 0, record stock movement
    if (parseFloat(current_stock) > 0) {
      await query(
        `INSERT INTO stock_movements
           (product_id, movement_type, qty, balance_after, reference_type, notes, created_by)
         VALUES ($1, 'opening', $2, $2, 'adjustment', 'Opening stock', $3)`,
        [rows[0].id, current_stock, req.user.id]
      );
    }

    res.status(201).json({ product: rows[0] });
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const {
      category_id, sku, name, name_bn, brand, size, unit,
      retail_price, wholesale_price, purchase_cost,
      low_stock_alert, is_active, notes,
    } = req.body;

    const { rows } = await query(
      `UPDATE products SET
         category_id = COALESCE($1, category_id),
         sku = COALESCE($2, sku),
         name = COALESCE($3, name),
         name_bn = COALESCE($4, name_bn),
         brand = COALESCE($5, brand),
         size = COALESCE($6, size),
         unit = COALESCE($7, unit),
         retail_price = COALESCE($8, retail_price),
         wholesale_price = COALESCE($9, wholesale_price),
         purchase_cost = COALESCE($10, purchase_cost),
         low_stock_alert = COALESCE($11, low_stock_alert),
         is_active = COALESCE($12, is_active),
         notes = COALESCE($13, notes),
         updated_at = NOW()
       WHERE id = $14 RETURNING *`,
      [
        category_id, sku, name, name_bn, brand, size, unit,
        retail_price, wholesale_price, purchase_cost,
        low_stock_alert, is_active, notes,
        req.params.id,
      ]
    );

    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    // Check for sale/purchase history
    const { rows: salesCheck } = await query(
      `SELECT COUNT(*) FROM sale_items WHERE product_id = $1`,
      [req.params.id]
    );
    if (parseInt(salesCheck[0].count) > 0) {
      return res.status(409).json({ error: 'Product has sales history — deactivate instead of delete' });
    }

    await query('UPDATE products SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deactivated' });
  } catch (err) { next(err); }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json({ products: [] });

    const { rows } = await query(
      `SELECT p.id, p.sku, p.name, p.name_bn, p.unit, p.brand, p.size,
              p.retail_price, p.wholesale_price, p.purchase_cost, p.current_stock
       FROM products p
       WHERE p.is_active = true
         AND (p.name ILIKE $1 OR p.sku ILIKE $1 OR p.brand ILIKE $1 OR p.size ILIKE $1)
       ORDER BY p.name
       LIMIT 30`,
      [`%${q}%`]
    );
    res.json({ products: rows });
  } catch (err) { next(err); }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts };
