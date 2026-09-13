const { query, withTransaction } = require('../../config/db');
const { nextInvoiceNo, parsePagination, safeFloat } = require('../../utils/helpers');

const listAccounts = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM accounts WHERE is_active = true ORDER BY type, name`
    );
    const totals = rows.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + parseFloat(a.balance);
      acc.total = (acc.total || 0) + parseFloat(a.balance);
      return acc;
    }, {});
    res.json({ accounts: rows, totals });
  } catch (err) { next(err); }
};

const getAccount = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Account not found' });
    res.json({ account: rows[0] });
  } catch (err) { next(err); }
};

const createAccount = async (req, res, next) => {
  try {
    const { name, name_bn, type, opening_balance = 0, is_default = false, notes } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'name and type are required' });
    if (!['cash', 'bank', 'capital'].includes(type)) {
      return res.status(400).json({ error: 'type must be cash, bank, or capital' });
    }

    const { rows } = await query(
      `INSERT INTO accounts (name, name_bn, type, balance, is_default, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, name_bn || null, type, opening_balance, is_default, notes || null]
    );

    if (parseFloat(opening_balance) !== 0) {
      await query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, description)
         VALUES ($1, 'opening', $2, $2, 'Opening balance')`,
        [rows[0].id, opening_balance]
      );
    }

    res.status(201).json({ account: rows[0] });
  } catch (err) { next(err); }
};

const updateAccount = async (req, res, next) => {
  try {
    const { name, name_bn, is_active, is_default, notes } = req.body;
    const { rows } = await query(
      `UPDATE accounts SET
         name = COALESCE($1, name),
         name_bn = COALESCE($2, name_bn),
         is_active = COALESCE($3, is_active),
         is_default = COALESCE($4, is_default),
         notes = COALESCE($5, notes)
       WHERE id = $6 RETURNING *`,
      [name, name_bn, is_active, is_default, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Account not found' });
    res.json({ account: rows[0] });
  } catch (err) { next(err); }
};

const getStatement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, page, limit, offset } = { ...parsePagination(req.query), ...req.query };
    const { page: p, limit: l, offset: o } = parsePagination(req.query);
    const params = [id];
    let dateFilter = '';
    if (req.query.start_date) { params.push(req.query.start_date); dateFilter += ` AND created_at >= $${params.length}`; }
    if (req.query.end_date) { params.push(req.query.end_date); dateFilter += ` AND created_at <= $${params.length}`; }

    const countRes = await query(
      `SELECT COUNT(*) FROM account_transactions WHERE account_id = $1 ${dateFilter}`, params
    );

    params.push(l, o);
    const { rows } = await query(
      `SELECT * FROM account_transactions
       WHERE account_id = $1 ${dateFilter}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ transactions: rows, total: parseInt(countRes.rows[0].count), page: p, limit: l });
  } catch (err) { next(err); }
};

const deposit = async (req, res, next) => {
  try {
    const { amount, description, date } = req.body;
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    await withTransaction(async (client) => {
      const { rows } = await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance`,
        [amountNum, req.params.id]
      );
      if (!rows.length) throw { status: 404, message: 'Account not found' };

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, description, created_by)
         VALUES ($1, 'deposit', $2, $3, $4, $5)`,
        [req.params.id, amountNum, rows[0].balance, description || 'Deposit', req.user.id]
      );
    });

    res.json({ message: 'Deposit recorded' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const withdraw = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    await withTransaction(async (client) => {
      const { rows: acctRows } = await client.query(
        'SELECT balance FROM accounts WHERE id = $1',
        [req.params.id]
      );
      if (!acctRows.length) throw { status: 404, message: 'Account not found' };
      if (parseFloat(acctRows[0].balance) < amountNum) {
        throw { status: 400, message: 'Insufficient account balance' };
      }

      const { rows } = await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
        [amountNum, req.params.id]
      );

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, description, created_by)
         VALUES ($1, 'withdrawal', $2, $3, $4, $5)`,
        [req.params.id, -amountNum, rows[0].balance, description || 'Withdrawal', req.user.id]
      );
    });

    res.json({ message: 'Withdrawal recorded' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

const transfer = async (req, res, next) => {
  try {
    const { to_account_id, amount, notes } = req.body;
    const amountNum = safeFloat(amount);
    if (amountNum <= 0) return res.status(400).json({ error: 'Amount must be positive' });
    if (String(req.params.id).trim() === String(to_account_id).trim()) {
      return res.status(400).json({ error: 'Cannot transfer to the same account' });
    }

    const result = await withTransaction(async (client) => {
      // Check source balance
      const { rows: checkRows } = await client.query(
        `SELECT balance FROM accounts WHERE id = $1`,
        [req.params.id]
      );
      if (!checkRows.length) throw { status: 404, message: 'Source account not found' };
      if (parseFloat(checkRows[0].balance) < amountNum) {
        throw { status: 400, message: 'Insufficient balance in source account' };
      }

      // Debit from source
      const { rows: fromRows } = await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance, name`,
        [amountNum, req.params.id]
      );

      // Credit to destination
      const { rows: toRows } = await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance, name`,
        [amountNum, to_account_id]
      );
      if (!toRows.length) throw { status: 404, message: 'Destination account not found' };

      const transfer_no = await nextInvoiceNo(client, 'TRF');

      const { rows: tRows } = await client.query(
        `INSERT INTO transfers (transfer_no, from_account_id, to_account_id, amount, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [transfer_no, req.params.id, to_account_id, amountNum, notes || null, req.user.id]
      );

      await client.query(
        `INSERT INTO account_transactions
           (account_id, transaction_type, amount, balance_after, reference_id, reference_type, description, created_by)
         VALUES
           ($1, 'transfer_out', $2, $3, $4, 'transfer', $5, $6),
           ($7, 'transfer_in', $8, $9, $4, 'transfer', $10, $6)`,
        [
          req.params.id, -amountNum, fromRows[0].balance, tRows[0].id,
          `Transfer to ${toRows[0].name} (${transfer_no})`, req.user.id,
          to_account_id, amountNum, toRows[0].balance,
          `Transfer from ${fromRows[0].name} (${transfer_no})`,
        ]
      );

      return tRows[0];
    });

    res.status(201).json({ transfer: result, message: `Transfer ${result.transfer_no} completed` });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

module.exports = {
  listAccounts, getAccount, createAccount, updateAccount,
  getStatement, deposit, withdraw, transfer,
};
