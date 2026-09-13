const { query, withTransaction } = require('../../config/db');

const TABLES = [
  'settings',
  'invoice_sequences',
  'categories',
  'expense_categories',
  'products',
  'customers',
  'suppliers',
  'accounts',
  'sales',
  'sale_items',
  'purchases',
  'purchase_items',
  'stock_movements',
  'customer_payments',
  'supplier_payments',
  'expenses',
  'transfers',
  'account_transactions',
];

const exportDatabase = async (req, res, next) => {
  try {
    const backupData = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      exported_by: req.user?.username || 'admin',
      tables: {},
    };

    for (const table of TABLES) {
      const orderCol = table === 'settings' ? 'key' : (table === 'invoice_sequences' ? 'prefix' : 'id');
      const { rows } = await query(`SELECT * FROM ${table} ORDER BY ${orderCol} ASC`);
      backupData.tables[table] = rows;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=coretrade_backup_${new Date().toISOString().slice(0, 10)}.json`);
    res.json(backupData);
  } catch (err) {
    next(err);
  }
};

const importDatabase = async (req, res, next) => {
  try {
    const { backup } = req.body;
    if (!backup || !backup.tables) {
      return res.status(400).json({ error: 'Invalid backup file format' });
    }

    await withTransaction(async (client) => {
      // Restore in reverse order for deletions, then forward order for insertions
      for (const table of [...TABLES].reverse()) {
        if (table !== 'settings' && table !== 'invoice_sequences') {
          await client.query(`DELETE FROM ${table}`);
        }
      }

      for (const table of TABLES) {
        const rows = backup.tables[table];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        for (const row of rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
          const columns = keys.map((k) => `"${k}"`).join(', ');

          const conflictClause = table === 'settings'
            ? `ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`
            : table === 'invoice_sequences'
            ? `ON CONFLICT (prefix) DO UPDATE SET last_num = EXCLUDED.last_num, pad_length = EXCLUDED.pad_length, updated_at = NOW()`
            : `ON CONFLICT DO NOTHING`;

          await client.query(
            `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ${conflictClause}`,
            values
          );
        }

        // Reset sequence if table has auto-increment id
        await client.query(`
          SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), true)
        `).catch(() => {});
      }
    });

    res.json({ message: 'Backup restored successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { exportDatabase, importDatabase };
