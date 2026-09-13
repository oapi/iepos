const { pool } = require('../config/db');

async function deactivateCapitalAndPetty() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Soft-deactivate Capital and Petty Cash accounts
    await client.query(`
      UPDATE accounts
      SET is_active = false
      WHERE type = 'capital' OR name ILIKE '%petty%';
    `);

    await client.query('COMMIT');
    console.log('✅ Deactivated Capital and Petty Cash accounts successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Update failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

deactivateCapitalAndPetty();
