const { query, withTransaction } = require('../../config/db');
const { nextInvoiceNo, parsePagination, safeFloat } = require('../../utils/helpers');

const listExpenses = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { start_date, end_date, category_id } = req.query;
    const params = [];
    const conditions = [];

    if (start_date) { params.push(start_date); conditions.push(`e.expense_date >= $${params.length}`); }
    if (end_date) { params.push(end_date); conditions.push(`e.expense_date <= $${params.length}`); }
    if (category_id) { params.push(category_id); conditions.push(`e.category_id = $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await query(`SELECT COUNT(*) FROM expenses e ${where}`, params);

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT e.*, ec.name AS category_name, a.name AS account_name
       FROM expenses e
       LEFT JOIN expense_categories ec ON e.category_id = ec.id
       LEFT JOIN accounts a ON e.account_id = a.id
       ${where}
       ORDER BY e.expense_date DESC, e.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ expenses: rows, total: parseInt(countRes.rows[0].count), page, limit });
  } catch (err) { next(err); }
};

const createExpense = async (req, res, next) => {
  try {
    const { category_id, account_id, expense_date, amount, description } = req.body;
    if (!account_id || !amount || !description) {
      return res.status(400).json({ error: 'account_id, amount, description are required' });
    }
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    const result = await withTransaction(async (client) => {
      // Check account balance
      const { rows: acctRows } = await client.query(
        `SELECT balance FROM accounts WHERE id = $1`, [account_id]
      );
      if (!acctRows.length) throw { status: 404, message: 'Account not found' };
      if (parseFloat(acctRows[0].balance) < amountNum) {
        throw { status: 400, message: 'Insufficient balance in selected account' };
      }

      const expense_no = await nextInvoiceNo(client, 'EXP');

      const { rows: expRows } = await client.query(
        `INSERT INTO expenses (expense_no, expense_date, category_id, account_id, amount, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [expense_no, expense_date || new Date().toISOString().slice(0, 10),
         category_id || null, account_id, amountNum, description, req.user.id]
      );

      // Debit account
      const { rows: updRows } = await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
        [amountNum, account_id]
      );

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
         VALUES ($1, 'expense', $2, $3, $4, 'expense', $5, $6)`,
        [account_id, -amountNum, updRows[0].balance, expRows[0].id, description, req.user.id]
      );

      return expRows[0];
    });

    res.status(201).json({ expense: result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { description, category_id } = req.body;
    // Only allow editing description and category — not financial values
    const { rows } = await query(
      `UPDATE expenses SET
         description = COALESCE($1, description),
         category_id = COALESCE($2, category_id),
         updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [description, category_id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Expense not found' });
    res.json({ expense: rows[0] });
  } catch (err) { next(err); }
};

const listExpenseCategories = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM expense_categories WHERE is_active = true ORDER BY name`
    );
    res.json({ categories: rows });
  } catch (err) { next(err); }
};

module.exports = { listExpenses, createExpense, updateExpense, listExpenseCategories };
