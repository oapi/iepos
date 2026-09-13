const { query } = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const listSuppliers = async (req, res, next) => {
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
    const countRes = await query(`SELECT COUNT(*) FROM suppliers ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT * FROM suppliers ${where} ORDER BY name
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ suppliers: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const getSupplier = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Supplier not found' });

    const { rows: lastTxn } = await query(
      `SELECT MAX(created_at) AS last_transaction FROM (
         SELECT created_at FROM purchases WHERE supplier_id = $1 AND status = 'completed'
         UNION ALL
         SELECT created_at FROM supplier_payments WHERE supplier_id = $1
       ) t`,
      [req.params.id]
    );

    res.json({ supplier: { ...rows[0], last_transaction: lastTxn[0].last_transaction } });
  } catch (err) { next(err); }
};

const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, address, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const { rows } = await query(
      `INSERT INTO suppliers (name, phone, address, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name.trim(), phone || null, address || null, notes || null]
    );
    res.status(201).json({ supplier: rows[0] });
  } catch (err) { next(err); }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { name, phone, address, is_active, notes } = req.body;
    const { rows } = await query(
      `UPDATE suppliers SET
         name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         address = COALESCE($3, address),
         is_active = COALESCE($4, is_active),
         notes = COALESCE($5, notes),
         updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name, phone, address, is_active, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ supplier: rows[0] });
  } catch (err) { next(err); }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT COUNT(*) FROM purchases WHERE supplier_id = $1`,
      [req.params.id]
    );
    if (parseInt(rows[0].count) > 0) {
      return res.status(409).json({ error: 'Supplier has purchase history — deactivate instead' });
    }
    await query('DELETE FROM suppliers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Supplier deleted' });
  } catch (err) { next(err); }
};

const getSupplierLedger = async (req, res, next) => {
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
           p.purchase_date::DATE AS txn_date,
           p.invoice_no AS reference,
           'Purchase' AS type,
           p.total AS debit,
           0 AS credit,
           p.id AS ref_id
         FROM purchases p
         WHERE p.supplier_id = $1 AND p.status = 'completed'

         UNION ALL

         SELECT
           sp.payment_date::DATE AS txn_date,
           sp.payment_no AS reference,
           'Payment' AS type,
           0 AS debit,
           sp.amount AS credit,
           sp.id AS ref_id
         FROM supplier_payments sp
         WHERE sp.supplier_id = $1
       ) t
       WHERE 1=1 ${dateFilter}
       ORDER BY txn_date, reference`,
      params
    );

    let balance = 0;
    const ledger = rows.map((row) => {
      balance = balance + parseFloat(row.debit) - parseFloat(row.credit);
      return { ...row, balance };
    });

    res.json({ ledger });
  } catch (err) { next(err); }
};

module.exports = {
  listSuppliers, getSupplier, createSupplier, updateSupplier,
  deleteSupplier, getSupplierLedger,
};
