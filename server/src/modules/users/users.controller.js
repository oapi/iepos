const argon2 = require('argon2');
const { query } = require('../../config/db');
const { sanitizeUser } = require('../../utils/helpers');

const listUsers = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, username, full_name, role, is_active, last_login_at, created_at
       FROM users ORDER BY created_at ASC`
    );
    res.json({ users: rows });
  } catch (err) { next(err); }
};

const getUser = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, username, full_name, role, is_active, last_login_at, created_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const { username, full_name, password, role } = req.body;
    if (!username || !full_name || !password || !role) {
      return res.status(400).json({ error: 'username, full_name, password, role are required' });
    }
    if (!['admin', 'manager', 'cashier'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const hash = await argon2.hash(password, {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
    });

    const { rows } = await query(
      `INSERT INTO users (username, full_name, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, full_name, role, is_active, created_at`,
      [username.toLowerCase().trim(), full_name.trim(), hash, role]
    );

    res.status(201).json({ user: rows[0] });
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const { full_name, role, is_active } = req.body;
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user.id === id && is_active === false) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    const { rows } = await query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           role = COALESCE($2, role),
           is_active = COALESCE($3, is_active),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, username, full_name, role, is_active`,
      [full_name, role, is_active, id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const hash = await argon2.hash(new_password, {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
    });

    const { rows } = await query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username`,
      [hash, req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Password reset successfully' });
  } catch (err) { next(err); }
};

module.exports = { listUsers, getUser, createUser, updateUser, resetPassword };
