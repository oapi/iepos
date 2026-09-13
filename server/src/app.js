require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security ─────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Frontend handles its own CSP
}));

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',').map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true, // Required for cookies
}));

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Rate Limiting ────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300,
  message: { error: 'Too many requests. Please slow down.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/categories', require('./modules/categories/categories.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/customers', require('./modules/customers/customers.routes'));
app.use('/api/suppliers', require('./modules/suppliers/suppliers.routes'));
app.use('/api/sales', require('./modules/sales/sales.routes'));
app.use('/api/purchases', require('./modules/purchases/purchases.routes'));
app.use('/api/payments', require('./modules/payments/payments.routes'));
app.use('/api/accounts', require('./modules/accounts/accounts.routes'));
app.use('/api/inventory', require('./modules/inventory/inventory.routes'));
app.use('/api/expenses', require('./modules/expenses/expenses.routes'));
app.use('/api/reports', require('./modules/reports/reports.routes'));
app.use('/api/settings', require('./modules/settings/settings.routes'));
app.use('/api/backup', require('./modules/backup/backup.routes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Static Frontend Files ────────────────────────────────
const path = require('path');
const publicDir = path.join(__dirname, '../public');
const fs = require('fs');

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// ─── 404 Handler for API ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Error Handler (must be last) ─────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ CoreTrade ERP Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API: http://localhost:${PORT}/api/health`);
});

module.exports = app;
