const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');
const { pool } = require('../config/db');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');
    const schema = fs.readFileSync(
      path.join(__dirname, '../../migrations/001_schema.sql'),
      'utf8'
    );
    await client.query(schema);
    console.log('✅ Schema migration complete.');

    console.log('🔄 Running seed...');
    const seed = fs.readFileSync(
      path.join(__dirname, '../../migrations/002_seed.sql'),
      'utf8'
    );
    await client.query(seed);

    // Create admin user with real argon2 hash
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

    console.log('✅ Seed complete.');
    console.log('');
    console.log('🎉 Database ready!');
    console.log('   Admin username: admin');
    console.log(`   Admin password: ${adminPassword}`);
    console.log('   ⚠️  Change the admin password after first login!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
