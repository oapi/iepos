const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('../config/db');
const fs = require('fs');
const argon2 = require('argon2');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running seed...');
    const seedSql = fs.readFileSync(
      path.join(__dirname, '../../migrations/002_seed.sql'),
      'utf8'
    );
    await client.query(seedSql);

    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const hash = await argon2.hash(adminPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await client.query(`
      INSERT INTO users (username, full_name, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (username)
      DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, ['admin', 'Administrator', hash]);

    console.log('✅ Seed completed successfully.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
