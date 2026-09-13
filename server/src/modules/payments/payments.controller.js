const { query, withTransaction } = require('../../config/db');
const { nextInvoiceNo, parsePagination, safeFloat } = require('../../utils/helpers');

// ─── Customer Payments ────────────────────────────────────

const createCustomerPayment = async (req, res, next) => {
  try {
    const { customer_id, account_id, payment_date, amount, method, reference, notes } = req.body;
    if (!customer_id || !account_id || !amount) {
      return res.status(400).json({ error: 'customer_id, account_id, amount are required' });
    }
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    const result = await withTransaction(async (client) => {
      // Verify customer exists
      const { rows: custRows } = await client.query(
        `SELECT id, name, balance FROM customers WHERE id = $1`,
        [customer_id]
      );
      if (!custRows.length) throw { status: 404, message: 'Customer not found' };

      const payment_no = await nextInvoiceNo(client, 'PAY');

      const { rows: payRows } = await client.query(
        `INSERT INTO customer_payments
           (payment_no, payment_date, customer_id, account_id, amount, method, reference, notes, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [payment_no, payment_date || new Date().toISOString().slice(0, 10),
         customer_id, account_id, amountNum, method || 'cash', reference || null, notes || null, req.user.id]
      );

      // Reduce customer balance
      await client.query(
        `UPDATE customers SET balance = balance - $1 WHERE id = $2`,
        [amountNum, customer_id]
      );

      // Add to account
      const { rows: acctRows } = await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance`,
        [amountNum, account_id]
      );

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
         VALUES ($1, 'customer_payment', $2, $3, $4, 'customer_payment', $5, $6)`,
        [account_id, amountNum, acctRows[0].balance, payRows[0].id,
         `Payment from ${custRows[0].name} (${payment_no})`, req.user.id]
      );

      return payRows[0];
    });

    res.status(201).json({ payment: result, message: `Payment recorded: ${result.payment_no}` });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const listCustomerPayments = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { customer_id, start_date, end_date } = req.query;
    const params = [];
    const conditions = [];

    if (customer_id) { params.push(customer_id); conditions.push(`cp.customer_id = $${params.length}`); }
    if (start_date) { params.push(start_date); conditions.push(`cp.payment_date >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`cp.payment_date <= $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await query(`SELECT COUNT(*) FROM customer_payments cp ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT cp.*, c.name AS customer_name, a.name AS account_name
       FROM customer_payments cp
       LEFT JOIN customers c ON cp.customer_id = c.id
       LEFT JOIN accounts a ON cp.account_id = a.id
       ${where}
       ORDER BY cp.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ payments: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

// ─── Supplier Payments ────────────────────────────────────

const createSupplierPayment = async (req, res, next) => {
  try {
    const { supplier_id, account_id, payment_date, amount, method, reference, notes } = req.body;
    if (!supplier_id || !account_id || !amount) {
      return res.status(400).json({ error: 'supplier_id, account_id, amount are required' });
    }
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    const result = await withTransaction(async (client) => {
      const { rows: suppRows } = await client.query(
        `SELECT id, name FROM suppliers WHERE id = $1`,
        [supplier_id]
      );
      if (!suppRows.length) throw { status: 404, message: 'Supplier not found' };

      const { rows: acctCheck } = await client.query(
        `SELECT balance FROM accounts WHERE id = $1`,
        [account_id]
      );
      if (!acctCheck.length) throw { status: 404, message: 'Account not found' };
      if (parseFloat(acctCheck[0].balance) < amountNum) {
        throw { status: 400, message: 'Insufficient balance in selected payment account' };
      }

      const payment_no = await nextInvoiceNo(client, 'PAY');

      const { rows: payRows } = await client.query(
        `INSERT INTO supplier_payments
           (payment_no, payment_date, supplier_id, account_id, amount, method, reference, notes, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [payment_no, payment_date || new Date().toISOString().slice(0, 10),
         supplier_id, account_id, amountNum, method || 'cash', reference || null, notes || null, req.user.id]
      );

      // Reduce supplier balance
      await client.query(
        `UPDATE suppliers SET balance = balance - $1 WHERE id = $2`,
        [amountNum, supplier_id]
      );

      // Debit account
      const { rows: acctRows } = await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
        [amountNum, account_id]
      );

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
         VALUES ($1, 'supplier_payment', $2, $3, $4, 'supplier_payment', $5, $6)`,
        [account_id, -amountNum, acctRows[0].balance, payRows[0].id,
         `Payment to ${suppRows[0].name} (${payment_no})`, req.user.id]
      );

      return payRows[0];
    });

    res.status(201).json({ payment: result, message: `Payment recorded: ${result.payment_no}` });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const listSupplierPayments = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { supplier_id, start_date, end_date } = req.query;
    const params = [];
    const conditions = [];

    if (supplier_id) { params.push(supplier_id); conditions.push(`sp.supplier_id = $${params.length}`); }
    if (start_date) { params.push(start_date); conditions.push(`sp.payment_date >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`sp.payment_date <= $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await query(`SELECT COUNT(*) FROM supplier_payments sp ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT sp.*, s.name AS supplier_name, a.name AS account_name
       FROM supplier_payments sp
       LEFT JOIN suppliers s ON sp.supplier_id = s.id
       LEFT JOIN accounts a ON sp.account_id = a.id
       ${where}
       ORDER BY sp.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ payments: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

module.exports = {
  createCustomerPayment, listCustomerPayments,
  createSupplierPayment, listSupplierPayments,
};
