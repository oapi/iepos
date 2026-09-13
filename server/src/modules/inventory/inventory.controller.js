const { query, withTransaction } = require('../../config/db');
const { parsePagination, safeFloat } = require('../../utils/helpers');

// ─── Inventory / Stock Movements ─────────────────────────

const listStockMovements = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { product_id, movement_type, start_date, end_date } = req.query;
    const params = [];
    const conditions = [];

    if (product_id) { params.push(product_id); conditions.push(`sm.product_id = $${params.length}`); }
    if (movement_type) { params.push(movement_type); conditions.push(`sm.movement_type = $${params.length}`); }
    if (start_date) { params.push(start_date); conditions.push(`sm.created_at >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`sm.created_at <= $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await query(`SELECT COUNT(*) FROM stock_movements sm ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT sm.*, p.name AS product_name, p.sku, p.unit, u.full_name AS created_by_name
       FROM stock_movements sm
       LEFT JOIN products p ON sm.product_id = p.id
       LEFT JOIN users u ON sm.created_by = u.id
       ${where}
       ORDER BY sm.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ movements: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const adjustStock = async (req, res, next) => {
  try {
    const { product_id, adjustment_type, qty, notes } = req.body;
    if (!product_id || !adjustment_type || !qty) {
      return res.status(400).json({ error: 'product_id, adjustment_type, qty are required' });
    }
    if (!['adjustment_in', 'adjustment_out'].includes(adjustment_type)) {
      return res.status(400).json({ error: 'adjustment_type must be adjustment_in or adjustment_out' });
    }

    const qtyNum = safeFloat(qty);
    if (qtyNum <= 0) return res.status(400).json({ error: 'Quantity must be positive' });

    await withTransaction(async (client) => {
      const { rows: prodRows } = await client.query(
        `SELECT id, name, current_stock FROM products WHERE id = $1`,
        [product_id]
      );
      if (!prodRows.length) throw { status: 404, message: 'Product not found' };

      if (adjustment_type === 'adjustment_out' && parseFloat(prodRows[0].current_stock) < qtyNum) {
        throw { status: 400, message: `Cannot adjust out more than available stock (${prodRows[0].current_stock})` };
      }

      const delta = adjustment_type === 'adjustment_in' ? qtyNum : -qtyNum;
      const { rows: updRows } = await client.query(
        `UPDATE products SET current_stock = current_stock + $1, updated_at = NOW()
         WHERE id = $2 RETURNING current_stock`,
        [delta, product_id]
      );

      await client.query(
        `INSERT INTO stock_movements
           (product_id, movement_type, qty, balance_after, reference_type, notes, created_by)
         VALUES ($1, $2, $3, $4, 'adjustment', $5, $6)`,
        [product_id, adjustment_type, delta, updRows[0].current_stock, notes || null, req.user.id]
      );
    });

    res.json({ message: 'Stock adjustment recorded' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND p.current_stock <= p.low_stock_alert
       ORDER BY (p.current_stock - p.low_stock_alert) ASC`
    );
    res.json({ products: rows, count: rows.length });
  } catch (err) { next(err); }
};

const getStockSummary = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         p.id, p.name, p.sku, p.unit, p.current_stock,
         p.purchase_cost, p.retail_price,
         (p.current_stock * p.purchase_cost) AS stock_value_cost,
         (p.current_stock * p.retail_price) AS stock_value_retail,
         c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true
       ORDER BY c.name, p.name`
    );

    const totals = rows.reduce((acc, r) => ({
      stock_value_cost: acc.stock_value_cost + parseFloat(r.stock_value_cost || 0),
      stock_value_retail: acc.stock_value_retail + parseFloat(r.stock_value_retail || 0),
    }), { stock_value_cost: 0, stock_value_retail: 0 });

    res.json({ products: rows, totals });
  } catch (err) { next(err); }
};

module.exports = { listStockMovements, adjustStock, getLowStockProducts, getStockSummary };
