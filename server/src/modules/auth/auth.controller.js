const argon2 = require('argon2');
const { query } = require('../../config/db');
const { signToken, sendTokenCookie } = require('../../middleware/auth');
const { sanitizeUser } = require('../../utils/helpers');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { rows } = await query(
      'SELECT * FROM users WHERE username = $1',
      [username.toLowerCase().trim()]
    );

    const user = rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const token = signToken(user.id, user.role);
    sendTokenCookie(res, token);

    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('ct_token');
  res.json({ message: 'Logged out successfully' });
};

const me = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new password required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const valid = await argon2.verify(rows[0].password_hash, current_password);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hash = await argon2.hash(new_password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me, changePassword };
