const { query } = require('../config/db');

/**
 * Generate next invoice number for a given prefix
 * E.g. INV-00125, PUR-00045
 * This is atomic — uses FOR UPDATE to prevent race conditions
 */
const nextInvoiceNo = async (client, prefix) => {
  const { rows } = await client.query(
    `UPDATE invoice_sequences
     SET last_num = last_num + 1, updated_at = NOW()
     WHERE prefix = $1
     RETURNING last_num, pad_length`,
    [prefix]
  );
  if (!rows.length) throw new Error(`Unknown invoice prefix: ${prefix}`);
  const { last_num, pad_length } = rows[0];
  return `${prefix}-${String(last_num).padStart(pad_length, '0')}`;
};

/**
 * Format amount as Bangladeshi Taka string
 * Uses the South Asian numbering system: lakh, crore
 */
const formatTaka = (amount) => {
  const num = parseFloat(amount) || 0;
  return '৳ ' + num.toLocaleString('bn-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Paginate helper — returns { limit, offset, page }
 */
const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 50));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build WHERE clause from filter object
 * Returns { where, params }
 */
const buildDateFilter = (startDate, endDate, column = 'created_at') => {
  const conditions = [];
  const params = [];
  if (startDate) {
    params.push(startDate);
    conditions.push(`${column} >= $${params.length}`);
  }
  if (endDate) {
    params.push(endDate);
    conditions.push(`${column} <= $${params.length}`);
  }
  return { conditions, params };
};

/**
 * Validate that a number is positive and numeric
 */
const isPositiveNumber = (val) => {
  const n = parseFloat(val);
  return !isNaN(n) && n >= 0;
};

/**
 * Safe parse float — returns 0 on invalid input
 */
const safeFloat = (val, fallback = 0) => {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
};

/**
 * Get today's date as YYYY-MM-DD in local timezone
 */
const todayDate = () => new Date().toISOString().slice(0, 10);

/**
 * Strip sensitive fields from user object
 */
const sanitizeUser = (user) => {
  const { password_hash, ...safe } = user;
  return safe;
};

module.exports = {
  nextInvoiceNo,
  formatTaka,
  parsePagination,
  buildDateFilter,
  isPositiveNumber,
  safeFloat,
  todayDate,
  sanitizeUser,
};
