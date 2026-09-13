const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Generate JWT and set it as httpOnly cookie
 */
const signToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

const sendTokenCookie = (res, token) => {
  const isSecure = process.env.COOKIE_SECURE === 'true';
  res.cookie('ct_token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });
};

/**
 * Middleware: verify JWT from httpOnly cookie
 */
const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.ct_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists and is active
    const { rows } = await query(
      'SELECT id, username, full_name, role, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      res.clearCookie('ct_token');
      return res.status(401).json({ error: 'User not found or deactivated' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired, please login again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { signToken, sendTokenCookie, authenticate };
