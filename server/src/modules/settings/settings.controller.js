const { query } = require('../../config/db');

const getSettings = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT key, value FROM settings ORDER BY key');
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json({ settings });
  } catch (err) { next(err); }
};

const updateSettings = async (req, res, next) => {
  try {
    const allowed = [
      'company_name', 'company_address', 'company_phone', 'company_email',
      'currency_symbol', 'default_language', 'low_stock_notify',
    ];

    for (const [key, value] of Object.entries(req.body)) {
      if (!allowed.includes(key)) continue;
      await query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [key, String(value)]
      );
    }

    res.json({ message: 'Settings updated' });
  } catch (err) { next(err); }
};

module.exports = { getSettings, updateSettings };
