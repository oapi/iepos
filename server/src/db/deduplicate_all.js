const { pool } = require('../config/db');

async function deduplicateAll() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting full database deduplication...');
    await client.query('BEGIN');

    // 1. EXPENSE CATEGORIES
    console.log('  -> Deduplicating Expense Categories...');
    const { rows: expCats } = await client.query(`SELECT id, name FROM expense_categories ORDER BY created_at ASC`);
    const expCatKeep = {};
    for (const ec of expCats) {
      if (!expCatKeep[ec.name]) {
        expCatKeep[ec.name] = ec.id;
      } else {
        // Re-point expenses to keep ID
        await client.query(`UPDATE expenses SET category_id = $1 WHERE category_id = $2`, [expCatKeep[ec.name], ec.id]);
        await client.query(`DELETE FROM expense_categories WHERE id = $1`, [ec.id]);
      }
    }

    // Add UNIQUE constraint on expense_categories(name) if not exists
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expense_categories_name_key') THEN
          ALTER TABLE expense_categories ADD CONSTRAINT expense_categories_name_key UNIQUE (name);
        END IF;
      END $$;
    `);

    // 2. PRODUCT CATEGORIES
    console.log('  -> Deduplicating Categories...');
    const { rows: cats } = await client.query(`SELECT id, slug FROM categories ORDER BY created_at ASC`);
    const catKeep = {};
    for (const c of cats) {
      if (!catKeep[c.slug]) {
        catKeep[c.slug] = c.id;
      } else {
        await client.query(`UPDATE products SET category_id = $1 WHERE category_id = $2`, [catKeep[c.slug], c.id]);
        await client.query(`DELETE FROM categories WHERE id = $1`, [c.id]);
      }
    }

    // 3. PRODUCTS
    console.log('  -> Deduplicating Products...');
    const { rows: prods } = await client.query(`SELECT id, sku, name FROM products ORDER BY created_at ASC`);
    const prodKeep = {};
    for (const p of prods) {
      const key = p.sku || p.name;
      if (!prodKeep[key]) {
        prodKeep[key] = p.id;
      } else {
        await client.query(`UPDATE sale_items SET product_id = $1 WHERE product_id = $2`, [prodKeep[key], p.id]);
        await client.query(`UPDATE purchase_items SET product_id = $1 WHERE product_id = $2`, [prodKeep[key], p.id]);
        await client.query(`UPDATE stock_movements SET product_id = $1 WHERE product_id = $2`, [prodKeep[key], p.id]);
        await client.query(`DELETE FROM products WHERE id = $1`, [p.id]);
      }
    }

    // 4. CUSTOMERS
    console.log('  -> Deduplicating Customers...');
    const { rows: custs } = await client.query(`SELECT id, name FROM customers ORDER BY created_at ASC`);
    const custKeep = {};
    for (const c of custs) {
      const key = c.name.trim().toLowerCase();
      if (!custKeep[key]) {
        custKeep[key] = c.id;
      } else {
        await client.query(`UPDATE sales SET customer_id = $1 WHERE customer_id = $2`, [custKeep[key], c.id]);
        await client.query(`UPDATE customer_payments SET customer_id = $1 WHERE customer_id = $2`, [custKeep[key], c.id]);
        await client.query(`DELETE FROM customers WHERE id = $1`, [c.id]);
      }
    }

    // Add UNIQUE constraint on customers(name) if not exists
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_name_key') THEN
          ALTER TABLE customers ADD CONSTRAINT customers_name_key UNIQUE (name);
        END IF;
      END $$;
    `);

    // 5. SUPPLIERS
    console.log('  -> Deduplicating Suppliers...');
    const { rows: supps } = await client.query(`SELECT id, name FROM suppliers ORDER BY created_at ASC`);
    const suppKeep = {};
    for (const s of supps) {
      const key = s.name.trim().toLowerCase();
      if (!suppKeep[key]) {
        suppKeep[key] = s.id;
      } else {
        await client.query(`UPDATE purchases SET supplier_id = $1 WHERE supplier_id = $2`, [suppKeep[key], s.id]);
        await client.query(`UPDATE supplier_payments SET supplier_id = $1 WHERE supplier_id = $2`, [suppKeep[key], s.id]);
        await client.query(`DELETE FROM suppliers WHERE id = $1`, [s.id]);
      }
    }

    // Add UNIQUE constraint on suppliers(name) if not exists
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'suppliers_name_key') THEN
          ALTER TABLE suppliers ADD CONSTRAINT suppliers_name_key UNIQUE (name);
        END IF;
      END $$;
    `);

    // 6. ACCOUNTS
    console.log('  -> Cleaning up inactive/duplicate Accounts...');
    const { rows: accts } = await client.query(`SELECT id, name, type, is_active FROM accounts ORDER BY is_active DESC, balance DESC`);
    const acctKeep = {};
    for (const a of accts) {
      const key = a.name.trim().toLowerCase();
      if (!acctKeep[key] && a.is_active) {
        acctKeep[key] = a.id;
      } else {
        // Re-point transactions to active account if possible
        if (acctKeep[key]) {
          await client.query(`UPDATE sales SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE purchases SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE customer_payments SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE supplier_payments SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE expenses SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE transfers SET from_account_id = $1 WHERE from_account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE transfers SET to_account_id = $1 WHERE to_account_id = $2`, [acctKeep[key], a.id]);
          await client.query(`UPDATE account_transactions SET account_id = $1 WHERE account_id = $2`, [acctKeep[key], a.id]);
        }
        // Delete inactive duplicate if no references remain
        await client.query(`
          DELETE FROM accounts WHERE id = $1
          AND id NOT IN (SELECT account_id FROM sales WHERE account_id IS NOT NULL)
          AND id NOT IN (SELECT account_id FROM purchases WHERE account_id IS NOT NULL)
          AND id NOT IN (SELECT account_id FROM customer_payments WHERE account_id IS NOT NULL)
          AND id NOT IN (SELECT account_id FROM supplier_payments WHERE account_id IS NOT NULL)
          AND id NOT IN (SELECT account_id FROM expenses WHERE account_id IS NOT NULL)
          AND id NOT IN (SELECT from_account_id FROM transfers)
          AND id NOT IN (SELECT to_account_id FROM transfers)
          AND id NOT IN (SELECT account_id FROM account_transactions);
        `, [a.id]).catch(() => {});
      }
    }

    await client.query('COMMIT');
    console.log('✅ All table deduplication finished successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Deduplication failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

deduplicateAll();
