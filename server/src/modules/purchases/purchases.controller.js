const { query, withTransaction } = require('../../config/db');
const { nextInvoiceNo, parsePagination, safeFloat } = require('../../utils/helpers');

const createPurchase = async (req, res, next) => {
  try {
    const {
      supplier_id, account_id, purchase_date,
      items, discount = 0, paid = 0, notes,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    const result = await withTransaction(async (client) => {
      let subtotal = 0;
      const enrichedItems = [];

      for (const item of items) {
        const { rows } = await client.query(
          `SELECT id, name, unit FROM products WHERE id = $1 AND is_active = true`,
          [item.product_id]
        );
        if (!rows.length) throw { status: 400, message: `Product not found` };
        const itemTotal = safeFloat(item.qty) * safeFloat(item.unit_cost) - safeFloat(item.discount || 0);
        subtotal += itemTotal;
        enrichedItems.push({ ...item, _product: rows[0], _total: itemTotal });
      }

      const totalDiscount = safeFloat(discount);
      const total = Math.max(0, subtotal - totalDiscount);
      const paidAmount = safeFloat(paid);
      const due = Math.max(0, total - paidAmount);

      const invoice_no = await nextInvoiceNo(client, 'PUR');

      const { rows: purRows } = await client.query(
        `INSERT INTO purchases
           (invoice_no, purchase_date, supplier_id, account_id,
            subtotal, discount, total, paid, due, notes, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING *`,
        [
          invoice_no,
          purchase_date || new Date().toISOString().slice(0, 10),
          supplier_id || null, account_id || null,
          subtotal, totalDiscount, total, paidAmount, due,
          notes || null, req.user.id,
        ]
      );
      const purchase = purRows[0];

      for (const item of enrichedItems) {
        await client.query(
          `INSERT INTO purchase_items
             (purchase_id, product_id, product_name, unit, qty, unit_cost, discount, total)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [purchase.id, item.product_id, item._product.name, item._product.unit,
           item.qty, item.unit_cost, item.discount || 0, item._total]
        );

        // Update stock
        const { rows: stockRows } = await client.query(
          `UPDATE products SET current_stock = current_stock + $1,
            purchase_cost = $2, updated_at = NOW()
           WHERE id = $3 RETURNING current_stock`,
          [item.qty, item.unit_cost, item.product_id]
        );

        await client.query(
          `INSERT INTO stock_movements
             (product_id, movement_type, qty, balance_after, reference_id, reference_type, created_by)
           VALUES ($1, 'purchase', $2, $3, $4, 'purchase', $5)`,
          [item.product_id, item.qty, stockRows[0].current_stock, purchase.id, req.user.id]
        );
      }

      // Update supplier balance
      if (supplier_id && due > 0) {
        await client.query(
          `UPDATE suppliers SET balance = balance + $1 WHERE id = $2`,
          [due, supplier_id]
        );
      }

      // Debit account for payment made
      if (account_id && paidAmount > 0) {
        const { rows: acctRows } = await client.query(
          `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
          [paidAmount, account_id]
        );
        await client.query(
          `INSERT INTO account_transactions
             (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
           VALUES ($1, 'purchase_payment', $2, $3, $4, 'purchase', $5, $6)`,
          [account_id, -paidAmount, acctRows[0].balance, purchase.id, `Purchase ${invoice_no}`, req.user.id]
        );
      }

      return purchase;
    });

    res.status(201).json({ purchase: result, message: `Purchase recorded. Ref: ${result.invoice_no}` });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const listPurchases = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { start_date, end_date, supplier_id } = req.query;
    const params = [];
    const conditions = ["p.status = 'completed'"];

    if (start_date) { params.push(start_date); conditions.push(`p.purchase_date >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`p.purchase_date <= $${params.length}`); }
    if (supplier_id) { params.push(supplier_id); conditions.push(`p.supplier_id = $${params.length}`); }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const countRes = await query(`SELECT COUNT(*) FROM purchases p ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT p.*, s.name AS supplier_name, a.name AS account_name, u.full_name AS created_by_name
       FROM purchases p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       LEFT JOIN accounts a ON p.account_id = a.id
       LEFT JOIN users u ON p.created_by = u.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ purchases: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const getPurchase = async (req, res, next) => {
  try {
    const { rows: purRows } = await query(
      `SELECT p.*, s.name AS supplier_name, a.name AS account_name
       FROM purchases p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       LEFT JOIN accounts a ON p.account_id = a.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (!purRows.length) return res.status(404).json({ error: 'Purchase not found' });

    const { rows: items } = await query(
      `SELECT pi.* FROM purchase_items pi WHERE pi.purchase_id = $1`,
      [req.params.id]
    );

    res.json({ purchase: purRows[0], items });
  } catch (err) { next(err); }
};

module.exports = { createPurchase, listPurchases, getPurchase };
