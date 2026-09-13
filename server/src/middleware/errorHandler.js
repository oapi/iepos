/**
 * Centralized error handler middleware
 * Must be registered last in Express app
 */
const errorHandler = (err, req, res, next) => {
  // PostgreSQL error codes
  const pgErrors = {
    '23505': { status: 409, message: 'A record with this value already exists' },
    '23503': { status: 409, message: 'This record is referenced by other data and cannot be deleted' },
    '23514': { status: 400, message: 'Value violates a database constraint' },
    '42703': { status: 500, message: 'Database column error' },
  };

  if (err.code && pgErrors[err.code]) {
    const pg = pgErrors[err.code];
    return res.status(pg.status).json({ error: pg.message, detail: err.detail });
  }

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json({ error: 'Validation failed', errors: err.errors });
  }

  // JWT errors (caught by auth middleware but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Default
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err);
  }

  // Never expose stack traces in production
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
