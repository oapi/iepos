/**
 * Role-Based Access Control Middleware
 *
 * Role hierarchy:
 *   admin    → full access
 *   manager  → most operations, no user management
 *   cashier  → POS, view reports
 */

const ROLE_LEVELS = { cashier: 1, manager: 2, admin: 3 };

/**
 * requireRole(...roles) — user must have one of the listed roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Access denied',
      required: roles,
      current: req.user.role,
    });
  }
  next();
};

/**
 * requireMinRole(minRole) — user must have at least this role level
 */
const requireMinRole = (minRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userLevel = ROLE_LEVELS[req.user.role] || 0;
  const minLevel = ROLE_LEVELS[minRole] || 99;
  if (userLevel < minLevel) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { requireRole, requireMinRole };
