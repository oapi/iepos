const { query, withTransaction } = require('../../config/db');
const { nextInvoiceNo, parsePagination, safeFloat } = require('../../utils/helpers');

/**
 * Create a sale (POS / credit / wholesale)
 * Runs in a single DB transaction:
 *   1. Validate stock for all items
 *   2. Insert sale header
 *   3. Insert sale items
 *   4. Update product stock (stock_movements)
 *   5. Update customer balance if credit
 *   6. Update account balance if paid
 */
const createSale = async (req, res, next) => {
  try {
    const {
      sale_type = 'cash',
      customer_id,
      account_id,
      sale_date,
      items, // [{ product_id, qty, unit_price, discount }]
      discount = 0,
      paid = 0,
      notes,
    } = req.body;

    const discountVal = req.body.discount !== undefined ? req.body.discount : (req.body.discount_amount || 0);
    const paidVal = req.body.paid !== undefined ? req.body.paid : (req.body.paid_amount !== undefined ? req.body.paid_amount : (sale_type === 'cash' ? null : 0));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    if (sale_type === 'credit' && !customer_id) {
      return res.status(400).json({ error: 'Customer is required for credit sales' });
    }

    const result = await withTransaction(async (client) => {
      // Normalize items
      for (const item of items) {
        item.qty = item.qty !== undefined ? item.qty : item.quantity;
        item.discount = item.discount !== undefined ? item.discount : (item.discount_amount || 0);
      }

      // 1. Validate stock for all items
      for (const item of items) {
        const { rows } = await client.query(
          `SELECT id, name, current_stock, unit FROM products WHERE id = $1 AND is_active = true`,
          [item.product_id]
        );
        if (!rows.length) throw { status: 400, message: `Product not found: ${item.product_id}` };
        const product = rows[0];
        if (safeFloat(product.current_stock) < safeFloat(item.qty)) {
          throw {
            status: 400,
            message: `Insufficient stock for "${product.name}". Available: ${product.current_stock} ${product.unit}`,
          };
        }
        item._product = product;
      }

      // 2. Calculate totals
      let subtotal = 0;
      for (const item of items) {
        const itemTotal = safeFloat(item.qty) * safeFloat(item.unit_price) - safeFloat(item.discount || 0);
        item._total = itemTotal;
        subtotal += itemTotal;
      }
      const totalDiscount = safeFloat(discountVal);
      const total = Math.max(0, subtotal - totalDiscount);
      let paidAmount;
      if (sale_type === 'cash' || (sale_type === 'wholesale' && !customer_id)) {
        paidAmount = total;
      } else {
        paidAmount = Math.min(total, Math.max(0, safeFloat(paidVal)));
      }
      const due = Math.max(0, total - paidAmount);

      if ((paidAmount > 0 || sale_type === 'cash') && !account_id) {
        throw { status: 400, message: 'Payment account is required for cash payments' };
      }

      // 3. Generate invoice number
      const invoice_no = await nextInvoiceNo(client, 'INV');

      // 4. Insert sale header
      const { rows: saleRows } = await client.query(
        `INSERT INTO sales
           (invoice_no, sale_date, sale_type, customer_id, account_id,
            subtotal, discount, total, paid, due, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          invoice_no,
          sale_date || new Date().toISOString().slice(0, 10),
          sale_type,
          customer_id || null,
          account_id || null,
          subtotal, totalDiscount, total, paidAmount, due,
          notes || null,
          req.user.id,
        ]
      );
      const sale = saleRows[0];

      // 5. Insert sale items + update stock
      for (const item of items) {
        await client.query(
          `INSERT INTO sale_items
             (sale_id, product_id, product_name, unit, qty, unit_price, discount, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            sale.id, item.product_id, item._product.name,
            item._product.unit, item.qty, item.unit_price,
            item.discount || 0, item._total,
          ]
        );

        // Update product stock
        const { rows: stockRows } = await client.query(
          `UPDATE products
           SET current_stock = current_stock - $1, updated_at = NOW()
           WHERE id = $2
           RETURNING current_stock`,
          [item.qty, item.product_id]
        );

        // Record stock movement
        await client.query(
          `INSERT INTO stock_movements
             (product_id, movement_type, qty, balance_after, reference_id, reference_type, created_by)
           VALUES ($1, 'sale', $2, $3, $4, 'sale', $5)`,
          [item.product_id, -Math.abs(safeFloat(item.qty)), stockRows[0].current_stock, sale.id, req.user.id]
        );
      }

      // 6. Update customer balance (credit due)
      if (customer_id && due > 0) {
        await client.query(
          `UPDATE customers SET balance = balance + $1 WHERE id = $2`,
          [due, customer_id]
        );
      }

      // 7. Update account balance for cash received
      if (account_id && paidAmount > 0) {
        const { rows: acctRows } = await client.query(
          `UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance`,
          [paidAmount, account_id]
        );
        await client.query(
          `INSERT INTO account_transactions
             (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
           VALUES ($1, 'sale_payment', $2, $3, $4, 'sale', $5, $6)`,
          [account_id, paidAmount, acctRows[0].balance, sale.id, `Sale ${invoice_no}`, req.user.id]
        );
      }

      return sale;
    });

    res.status(201).json({ sale: result, message: `Sale completed. Invoice: ${result.invoice_no}` });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const listSales = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { start_date, end_date, customer_id, sale_type, search } = req.query;
    const params = [];
    const conditions = ["s.status = 'completed'"];

    if (start_date) { params.push(start_date); conditions.push(`s.sale_date >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`s.sale_date <= $${params.length}`); }
    if (customer_id) { params.push(customer_id); conditions.push(`s.customer_id = $${params.length}`); }
    if (sale_type) { params.push(sale_type); conditions.push(`s.sale_type = $${params.length}`); }
    if (search) { params.push(`%${search}%`); conditions.push(`s.invoice_no ILIKE $${params.length}`); }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const countRes = await query(`SELECT COUNT(*) FROM sales s ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT s.*, c.name AS customer_name, a.name AS account_name,
              u.full_name AS created_by_name
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       LEFT JOIN accounts a ON s.account_id = a.id
       LEFT JOIN users u ON s.created_by = u.id
       ${where}
       ORDER BY s.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ sales: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const getSale = async (req, res, next) => {
  try {
    const { rows: saleRows } = await query(
      `SELECT s.*, c.name AS customer_name, c.phone AS customer_phone,
              a.name AS account_name, u.full_name AS created_by_name
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       LEFT JOIN accounts a ON s.account_id = a.id
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (!saleRows.length) return res.status(404).json({ error: 'Sale not found' });

    const { rows: items } = await query(
      `SELECT si.*, p.sku FROM sale_items si
       LEFT JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = $1 ORDER BY si.created_at`,
      [req.params.id]
    );

    res.json({ sale: saleRows[0], items });
  } catch (err) { next(err); }
};

const voidSale = async (req, res, next) => {
  try {
    const { void_reason } = req.body;
    if (!void_reason) return res.status(400).json({ error: 'Void reason is required' });

    await withTransaction(async (client) => {
      const { rows: saleRows } = await client.query(
        `SELECT * FROM sales WHERE id = $1`,
        [req.params.id]
      );
      if (!saleRows.length) throw { status: 404, message: 'Sale not found' };
      const sale = saleRows[0];
      if (sale.status === 'voided') throw { status: 400, message: 'Sale already voided' };

      // Restore stock
      const { rows: items } = await client.query(
        `SELECT * FROM sale_items WHERE sale_id = $1`,
        [sale.id]
      );
      for (const item of items) {
        const { rows: stockRows } = await client.query(
          `UPDATE products SET current_stock = current_stock + $1 WHERE id = $2
           RETURNING current_stock`,
          [item.qty, item.product_id]
        );
        await client.query(
          `INSERT INTO stock_movements
             (product_id, movement_type, qty, balance_after, reference_id, reference_type, notes, created_by)
           VALUES ($1, 'return_in', $2, $3, $4, 'sale', 'Void: ' || $5, $6)`,
          [item.product_id, item.qty, stockRows[0].current_stock, sale.id, void_reason, req.user.id]
        );
      }

      // Reverse customer balance
      if (sale.customer_id && parseFloat(sale.due) > 0) {
        await client.query(
          `UPDATE customers SET balance = balance - $1 WHERE id = $2`,
          [sale.due, sale.customer_id]
        );
      }

      // Reverse account balance
      if (sale.account_id && parseFloat(sale.paid) > 0) {
        const { rows: acctRows } = await client.query(
          `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
          [sale.paid, sale.account_id]
        );
        await client.query(
          `INSERT INTO account_transactions
             (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
           VALUES ($1, 'withdrawal', $2, $3, $4, 'sale_void', 'Void: ' || $5, $6)`,
          [sale.account_id, -parseFloat(sale.paid), acctRows[0].balance, sale.id, void_reason, req.user.id]
        );
      }

      // Mark voided
      await client.query(
        `UPDATE sales SET status = 'voided', void_reason = $1 WHERE id = $2`,
        [void_reason, sale.id]
      );
    });

    res.json({ message: 'Sale voided successfully' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

module.exports = { createSale, listSales, getSale, voidSale };
