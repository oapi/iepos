const { query } = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

// ─── CUSTOMERS ────────────────────────────────────────────

const listCustomers = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { search } = req.query;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await query(`SELECT COUNT(*) FROM customers ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT * FROM customers ${where} ORDER BY name
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ customers: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const getCustomer = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Customer not found' });

    // Last transaction date
    const { rows: lastTxn } = await query(
      `SELECT MAX(created_at) AS last_transaction FROM (
         SELECT created_at FROM sales WHERE customer_id = $1 AND status = 'completed'
         UNION ALL
         SELECT created_at FROM customer_payments WHERE customer_id = $1
       ) t`,
      [req.params.id]
    );

    res.json({ customer: { ...rows[0], last_transaction: lastTxn[0].last_transaction } });
  } catch (err) { next(err); }
};

const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, address, credit_limit, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const { rows } = await query(
      `INSERT INTO customers (name, phone, address, credit_limit, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim(), phone || null, address || null, credit_limit || 0, notes || null]
    );
    res.status(201).json({ customer: rows[0] });
  } catch (err) { next(err); }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { name, phone, address, credit_limit, is_active, notes } = req.body;
    const { rows } = await query(
      `UPDATE customers SET
         name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         address = COALESCE($3, address),
         credit_limit = COALESCE($4, credit_limit),
         is_active = COALESCE($5, is_active),
         notes = COALESCE($6, notes),
         updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, phone, address, credit_limit, is_active, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Customer not found' });
    res.json({ customer: rows[0] });
  } catch (err) { next(err); }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT COUNT(*) FROM sales WHERE customer_id = $1`,
      [req.params.id]
    );
    if (parseInt(rows[0].count) > 0) {
      return res.status(409).json({ error: 'Customer has transactions — deactivate instead' });
    }
    await query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) { next(err); }
};

const getCustomerLedger = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    const params = [id];
    let dateFilter = '';
    if (start_date) { params.push(start_date); dateFilter += ` AND txn_date >= $${params.length}`; }
    if (end_date) { params.push(end_date); dateFilter += ` AND txn_date <= $${params.length}`; }

    const { rows } = await query(
      `SELECT * FROM (
         SELECT
           s.sale_date::DATE AS txn_date,
           s.invoice_no AS reference,
           'Sale' AS type,
           s.total AS debit,
           0 AS credit,
           s.id AS ref_id
         FROM sales s
         WHERE s.customer_id = $1 AND s.status = 'completed'

         UNION ALL

         SELECT
           cp.payment_date::DATE AS txn_date,
           cp.payment_no AS reference,
           'Payment' AS type,
           0 AS debit,
           cp.amount AS credit,
           cp.id AS ref_id
         FROM customer_payments cp
         WHERE cp.customer_id = $1
       ) t
       WHERE 1=1 ${dateFilter}
       ORDER BY txn_date, reference`,
      params
    );

    // Compute running balance
    let balance = 0;
    const ledger = rows.map((row) => {
      balance = balance + parseFloat(row.debit) - parseFloat(row.credit);
      return { ...row, balance };
    });

    res.json({ ledger });
  } catch (err) { next(err); }
};

module.exports = {
  listCustomers, getCustomer, createCustomer, updateCustomer,
  deleteCustomer, getCustomerLedger,
};
