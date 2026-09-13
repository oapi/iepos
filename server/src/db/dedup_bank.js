const { pool } = require('../config/db');

async function deduplicateBank() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      UPDATE accounts
      SET is_active = false
      WHERE id = 'e492de2d-001f-478a-b3a9-d0b0dc784d67';
    `);
    await client.query('COMMIT');
    console.log('✅ Deduplicated bank accounts');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
deduplicateBank();
