const { pool } = require('../config/db');

async function cleanAccounts() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete unused 0 balance duplicates
    await client.query(`
      DELETE FROM accounts
      WHERE balance = 0
        AND id NOT IN (SELECT DISTINCT account_id FROM account_transactions)
        AND id NOT IN (SELECT account_id FROM sales WHERE account_id IS NOT NULL)
        AND id NOT IN (SELECT account_id FROM purchases WHERE account_id IS NOT NULL)
        AND id NOT IN (SELECT account_id FROM customer_payments WHERE account_id IS NOT NULL)
        AND id NOT IN (SELECT account_id FROM supplier_payments WHERE account_id IS NOT NULL)
        AND id NOT IN (SELECT account_id FROM expenses WHERE account_id IS NOT NULL);
    `);

    // Update names for clarity
    await client.query(`
      UPDATE accounts SET name = 'Owner Capital' WHERE name = 'Capital Account' OR name = 'Capital';
    `);

    // Insert clear example accounts for Petty Cash & Partner B Capital
    await client.query(`
      INSERT INTO accounts (name, name_bn, type, balance, is_default, notes) VALUES
        ('Petty Cash', 'ছোটখাটো খরচের ক্যাশ', 'cash', 15000.00, false, 'Daily office petty cash float'),
        ('Partner B Capital', 'পার্টনার বি মূলধন', 'capital', 250000.00, false, 'Partner B investment equity')
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ Accounts cleaned up successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanAccounts();
