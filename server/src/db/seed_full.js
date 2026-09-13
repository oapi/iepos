const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('../config/db');
const argon2 = require('argon2');

async function seedFull() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting database seed...');
    await client.query('BEGIN');

    // 1. Users
    console.log('  -> Seeding Users...');
    const adminHash = await argon2.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
    });
    const managerHash = await argon2.hash('Manager@1234', {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
    });
    const cashierHash = await argon2.hash('Cashier@1234', {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
    });

    const { rows: userRows } = await client.query(`
      INSERT INTO users (username, full_name, password_hash, role)
      VALUES 
        ('admin', 'Administrator', $1, 'admin'),
        ('manager', 'Sales Manager', $2, 'manager'),
        ('cashier', 'Cashier One', $3, 'cashier')
      ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
      RETURNING id, username, role;
    `, [adminHash, managerHash, cashierHash]);

    const adminUser = userRows.find(u => u.username === 'admin') || userRows[0];
    const managerUser = userRows.find(u => u.username === 'manager') || userRows[0];

    // 2. Categories
    console.log('  -> Seeding Categories...');
    await client.query(`
      INSERT INTO categories (name, name_bn, slug, sort_order) VALUES
        ('Rod / Steel', 'রড / স্টিল', 'rod-steel', 1),
        ('Cement', 'সিমেন্ট', 'cement', 2),
        ('Sand & Gravel', 'বালি ও পাথর', 'sand-gravel', 3),
        ('Brick', 'ইট', 'brick', 4),
        ('Hardware', 'হার্ডওয়্যার', 'hardware', 5),
        ('Paint', 'রং', 'paint', 6),
        ('Pipe & Fitting', 'পাইপ ও ফিটিং', 'pipe-fitting', 7),
        ('Electrical', 'ইলেকট্রিক্যাল', 'electrical', 8),
        ('Tile & Mosaic', 'টাইলস', 'tile-mosaic', 9),
        ('Other', 'অন্যান্য', 'other', 10)
      ON CONFLICT (slug) DO NOTHING;
    `);

    const { rows: categories } = await client.query(`SELECT id, slug FROM categories`);
    const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

    // 3. Expense Categories
    console.log('  -> Seeding Expense Categories...');
    await client.query(`
      INSERT INTO expense_categories (name, name_bn) VALUES
        ('Rent', 'ভাড়া'),
        ('Salary', 'বেতন'),
        ('Electricity', 'বিদ্যুৎ'),
        ('Transport', 'পরিবহন'),
        ('Telephone', 'টেলিফোন / মোবাইল'),
        ('Maintenance', 'রক্ষণাবেক্ষণ'),
        ('Packaging', 'প্যাকেজিং'),
        ('Office Supplies', 'অফিস সামগ্রী'),
        ('Marketing', 'বিজ্ঞাপন'),
        ('Other', 'অন্যান্য')
      ON CONFLICT DO NOTHING;
    `);

    const { rows: expCats } = await client.query(`SELECT id, name FROM expense_categories`);
    const expCatMap = Object.fromEntries(expCats.map(c => [c.name, c.id]));

    // 4. Products
    console.log('  -> Seeding Products...');
    const productsData = [
      { category_id: catMap['rod-steel'], sku: 'ROD-8MM', name: '8mm Deformed Bar (BSRM)', name_bn: '৮মিমি রড', brand: 'BSRM', size: '8mm', unit: 'ton', retail_price: 95000, wholesale_price: 94000, purchase_cost: 90000, current_stock: 12.5, low_stock_alert: 2 },
      { category_id: catMap['rod-steel'], sku: 'ROD-10MM', name: '10mm Deformed Bar (BSRM)', name_bn: '১০মিমি রড', brand: 'BSRM', size: '10mm', unit: 'ton', retail_price: 94500, wholesale_price: 93500, purchase_cost: 89500, current_stock: 18.0, low_stock_alert: 2 },
      { category_id: catMap['rod-steel'], sku: 'ROD-12MM', name: '12mm Deformed Bar (BSRM)', name_bn: '১২মিমি রড', brand: 'BSRM', size: '12mm', unit: 'ton', retail_price: 94000, wholesale_price: 93000, purchase_cost: 89000, current_stock: 25.0, low_stock_alert: 3 },
      { category_id: catMap['rod-steel'], sku: 'ROD-16MM', name: '16mm Deformed Bar (BSRM)', name_bn: '১৬মিমি রড', brand: 'BSRM', size: '16mm', unit: 'ton', retail_price: 93500, wholesale_price: 92500, purchase_cost: 88500, current_stock: 14.0, low_stock_alert: 2 },
      { category_id: catMap['cement'], sku: 'CEM-SHAH-50', name: 'Shah Cement (50 kg)', name_bn: 'শাহ সিমেন্ট (৫০ কেজি)', brand: 'Shah Cement', size: '50 kg', unit: 'bag', retail_price: 550, wholesale_price: 540, purchase_cost: 510, current_stock: 350, low_stock_alert: 30 },
      { category_id: catMap['cement'], sku: 'CEM-LAFARGE-50', name: 'Lafarge Holcim Cement (50 kg)', name_bn: 'লাফার্জ সিমেন্ট (৫০ কেজি)', brand: 'Lafarge', size: '50 kg', unit: 'bag', retail_price: 560, wholesale_price: 550, purchase_cost: 520, current_stock: 200, low_stock_alert: 25 },
      { category_id: catMap['cement'], sku: 'CEM-FRESH-50', name: 'Fresh Cement (50 kg)', name_bn: 'ফ্রেশ সিমেন্ট (৫০ কেজি)', brand: 'Fresh Cement', size: '50 kg', unit: 'bag', retail_price: 540, wholesale_price: 530, purchase_cost: 500, current_stock: 180, low_stock_alert: 20 },
      { category_id: catMap['sand-gravel'], sku: 'SAND-SYLHET', name: 'Sylhet Red Sand', name_bn: 'সিলেট লাল বালি', brand: 'Local', size: 'cft', unit: 'cft', retail_price: 45, wholesale_price: 42, purchase_cost: 35, current_stock: 1500, low_stock_alert: 200 },
      { category_id: catMap['sand-gravel'], sku: 'STONE-34', name: '3/4 inch Stone Chips', name_bn: '৩/৪ ইঞ্চি পাথর কুচি', brand: 'Panchagarh', size: 'cft', unit: 'cft', retail_price: 110, wholesale_price: 105, purchase_cost: 90, current_stock: 2200, low_stock_alert: 300 },
      { category_id: catMap['brick'], sku: 'BRICK-1ST', name: '1st Class Red Brick', name_bn: '১ম শ্রেণীর লাল ইট', brand: 'PBC Brick', size: 'standard', unit: 'pcs', retail_price: 12, wholesale_price: 11.5, purchase_cost: 9.8, current_stock: 15000, low_stock_alert: 2000 },
      { category_id: catMap['paint'], sku: 'PAINT-BERGER-18L', name: 'Berger WeatherCoat 18L', name_bn: 'বার্জার ওয়েদারকোট ১৮লিঃ', brand: 'Berger', size: '18L', unit: 'drum', retail_price: 7200, wholesale_price: 6900, purchase_cost: 6200, current_stock: 15, low_stock_alert: 3 },
      { category_id: catMap['pipe-fitting'], sku: 'PIPE-RFL-4IN', name: 'RFL 4 inch PVC Pipe (20ft)', name_bn: 'আরএফএল ৪" পিভিসি পাইপ (২০ফিট)', brand: 'RFL', size: '4 inch', unit: 'pcs', retail_price: 850, wholesale_price: 810, purchase_cost: 720, current_stock: 60, low_stock_alert: 10 },
    ];

    for (const p of productsData) {
      await client.query(`
        INSERT INTO products (category_id, sku, name, name_bn, brand, size, unit, retail_price, wholesale_price, purchase_cost, current_stock, low_stock_alert)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (sku) DO UPDATE SET
          retail_price = EXCLUDED.retail_price,
          wholesale_price = EXCLUDED.wholesale_price,
          purchase_cost = EXCLUDED.purchase_cost,
          current_stock = EXCLUDED.current_stock;
      `, [p.category_id, p.sku, p.name, p.name_bn, p.brand, p.size, p.unit, p.retail_price, p.wholesale_price, p.purchase_cost, p.current_stock, p.low_stock_alert]);
    }

    const { rows: prods } = await client.query(`SELECT id, sku, name, unit, retail_price, wholesale_price, purchase_cost FROM products`);
    const prodMap = Object.fromEntries(prods.map(p => [p.sku, p]));

    // 5. Customers
    console.log('  -> Seeding Customers...');
    await client.query(`
      INSERT INTO customers (name, phone, address, balance, credit_limit, notes) VALUES
        ('Haji Rahim Ullah', '+880 1711-223344', 'Station Road, Rod & Cement Market, Feni', 45000, 500000, 'Regular contractor customer'),
        ('Bengal Construction Ltd.', '+880 1819-887766', 'Plot 45, Commercial Area, Chittagong', 120000, 1000000, 'Corporate buyer'),
        ('Karim Enterprise', '+880 1912-334455', 'Main Market, Chowmuhani, Noakhali', 0, 200000, 'Retail reseller'),
        ('Jamal Uddin', '+880 1677-112233', 'Village House Project, Comilla', 15000, 100000, 'Private home builder')
      ON CONFLICT DO NOTHING;
    `);

    const { rows: custs } = await client.query(`SELECT id, name FROM customers`);
    const custMap = Object.fromEntries(custs.map(c => [c.name, c.id]));

    // 6. Suppliers
    console.log('  -> Seeding Suppliers...');
    await client.query(`
      INSERT INTO suppliers (name, phone, address, balance, notes) VALUES
        ('BSRM Steels Ltd.', '+880 31-2581400', 'BSRM Centre, Sadarghat Road, Chittagong', 150000, 'Primary steel bar supplier'),
        ('Shah Cement Industries Ltd.', '+880 2-9883505', 'House 11, Road 133, Gulshan-1, Dhaka', 45000, 'Cement manufacturer'),
        ('LafargeHolcim Bangladesh Ltd.', '+880 2-9881002', 'Ninaakambo, 54 Gulshan Ave, Dhaka', 0, 'Cement supplier'),
        ('RFL Group Ltd.', '+880 9613-737737', 'PRAN-RFL Centre, 105 Middle Badda, Dhaka', 25000, 'PVC pipe & fittings supplier')
      ON CONFLICT DO NOTHING;
    `);

    const { rows: supps } = await client.query(`SELECT id, name FROM suppliers`);
    const suppMap = Object.fromEntries(supps.map(s => [s.name, s.id]));

    // 7. Accounts
    console.log('  -> Seeding Accounts...');
    await client.query(`
      INSERT INTO accounts (name, name_bn, type, balance, is_default) VALUES
        ('Shop Cash', 'দোকান ক্যাশ', 'cash', 125000.00, true),
        ('Dutch-Bangla Bank', 'ডাচ-বাংলা ব্যাংক', 'bank', 385000.00, false),
        ('Islami Bank Bangladesh', 'ইসলামী ব্যাংক বাংলাদেশ', 'bank', 215000.00, false),
        ('Capital Account', 'মূলধন হিসাব', 'capital', 500000.00, false)
      ON CONFLICT DO NOTHING;
    `);

    const { rows: accts } = await client.query(`SELECT id, name, type FROM accounts`);
    const acctMap = Object.fromEntries(accts.map(a => [a.name, a.id]));

    // 8. Invoice Sequences
    console.log('  -> Initializing Invoice Sequences...');
    await client.query(`
      INSERT INTO invoice_sequences (prefix, last_num, pad_length) VALUES
        ('INV', 4, 5),
        ('PUR', 2, 5),
        ('PAY', 3, 5),
        ('EXP', 3, 5),
        ('TRF', 1, 5)
      ON CONFLICT (prefix) DO UPDATE SET last_num = EXCLUDED.last_num;
    `);

    // 9. Sales & Sale Items
    console.log('  -> Seeding Sales & Sale Items...');
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Sale 1: Cash sale
    const { rows: sale1Rows } = await client.query(`
      INSERT INTO sales (invoice_no, sale_date, sale_type, customer_id, account_id, subtotal, discount, total, paid, due, status, created_by)
      VALUES ('INV-00001', $1, 'cash', NULL, $2, 189000, 0, 189000, 189000, 0, 'completed', $3)
      ON CONFLICT (invoice_no) DO NOTHING
      RETURNING id;
    `, [yesterday, acctMap['Shop Cash'], adminUser.id]);

    if (sale1Rows.length > 0) {
      const sale1Id = sale1Rows[0].id;
      const rod10 = prodMap['ROD-10MM'];
      await client.query(`
        INSERT INTO sale_items (sale_id, product_id, product_name, unit, qty, unit_price, discount, total)
        VALUES ($1, $2, $3, $4, 2.0, 94500, 0, 189000);
      `, [sale1Id, rod10.id, rod10.name, rod10.unit]);

      await client.query(`
        INSERT INTO stock_movements (product_id, movement_type, qty, balance_after, reference_id, reference_type, notes, created_by)
        VALUES ($1, 'sale', -2.0, 18.0, $2, 'sale', 'Sale INV-00001', $3);
      `, [rod10.id, sale1Id, adminUser.id]);
    }

    // Sale 2: Credit sale
    const { rows: sale2Rows } = await client.query(`
      INSERT INTO sales (invoice_no, sale_date, sale_type, customer_id, account_id, subtotal, discount, total, paid, due, status, created_by)
      VALUES ('INV-00002', $1, 'credit', $2, $3, 94500, 0, 94500, 49500, 45000, 'completed', $4)
      ON CONFLICT (invoice_no) DO NOTHING
      RETURNING id;
    `, [today, custMap['Haji Rahim Ullah'], acctMap['Shop Cash'], managerUser.id]);

    if (sale2Rows.length > 0) {
      const sale2Id = sale2Rows[0].id;
      const rod10 = prodMap['ROD-10MM'];
      await client.query(`
        INSERT INTO sale_items (sale_id, product_id, product_name, unit, qty, unit_price, discount, total)
        VALUES ($1, $2, $3, $4, 1.0, 94500, 0, 94500);
      `, [sale2Id, rod10.id, rod10.name, rod10.unit]);

      await client.query(`
        INSERT INTO stock_movements (product_id, movement_type, qty, balance_after, reference_id, reference_type, notes, created_by)
        VALUES ($1, 'sale', -1.0, 17.0, $2, 'sale', 'Sale INV-00002', $3);
      `, [rod10.id, sale2Id, managerUser.id]);
    }

    // Sale 3: Wholesale sale to Bengal Construction
    const { rows: sale3Rows } = await client.query(`
      INSERT INTO sales (invoice_no, sale_date, sale_type, customer_id, account_id, subtotal, discount, total, paid, due, status, created_by)
      VALUES ('INV-00003', $1, 'wholesale', $2, $3, 220000, 0, 220000, 100000, 120000, 'completed', $4)
      ON CONFLICT (invoice_no) DO NOTHING
      RETURNING id;
    `, [today, custMap['Bengal Construction Ltd.'], acctMap['Dutch-Bangla Bank'], managerUser.id]);

    if (sale3Rows.length > 0) {
      const sale3Id = sale3Rows[0].id;
      const cemShah = prodMap['CEM-SHAH-50'];
      await client.query(`
        INSERT INTO sale_items (sale_id, product_id, product_name, unit, qty, unit_price, discount, total)
        VALUES ($1, $2, $3, $4, 400, 550, 0, 220000);
      `, [sale3Id, cemShah.id, cemShah.name, cemShah.unit]);

      await client.query(`
        INSERT INTO stock_movements (product_id, movement_type, qty, balance_after, reference_id, reference_type, notes, created_by)
        VALUES ($1, 'sale', -400, 350.0, $2, 'sale', 'Sale INV-00003', $3);
      `, [cemShah.id, sale3Id, managerUser.id]);
    }

    // 10. Purchases & Purchase Items
    console.log('  -> Seeding Purchases & Purchase Items...');
    const { rows: pur1Rows } = await client.query(`
      INSERT INTO purchases (invoice_no, purchase_date, supplier_id, account_id, subtotal, discount, total, paid, due, status, created_by)
      VALUES ('PUR-00001', $1, $2, $3, 450000, 0, 450000, 300000, 150000, 'completed', $4)
      ON CONFLICT (invoice_no) DO NOTHING
      RETURNING id;
    `, [yesterday, suppMap['BSRM Steels Ltd.'], acctMap['Dutch-Bangla Bank'], managerUser.id]);

    if (pur1Rows.length > 0) {
      const pur1Id = pur1Rows[0].id;
      const rod12 = prodMap['ROD-12MM'];
      await client.query(`
        INSERT INTO purchase_items (purchase_id, product_id, product_name, unit, qty, unit_cost, discount, total)
        VALUES ($1, $2, $3, $4, 5.0, 89000, 0, 445000);
      `, [pur1Id, rod12.id, rod12.name, rod12.unit]);

      await client.query(`
        INSERT INTO stock_movements (product_id, movement_type, qty, balance_after, reference_id, reference_type, notes, created_by)
        VALUES ($1, 'purchase', 5.0, 25.0, $2, 'purchase', 'Purchase PUR-00001', $3);
      `, [rod12.id, pur1Id, managerUser.id]);
    }

    // 11. Customer & Supplier Payments
    console.log('  -> Seeding Customer & Supplier Payments...');
    await client.query(`
      INSERT INTO customer_payments (payment_no, payment_date, customer_id, account_id, amount, method, reference, notes, created_by)
      VALUES ('PAY-00001', $1, $2, $3, 50000, 'cash', 'REC-9912', 'Partial due collection', $4)
      ON CONFLICT (payment_no) DO NOTHING;
    `, [today, custMap['Haji Rahim Ullah'], acctMap['Shop Cash'], managerUser.id]);

    await client.query(`
      INSERT INTO supplier_payments (payment_no, payment_date, supplier_id, account_id, amount, method, reference, notes, created_by)
      VALUES ('PAY-00002', $1, $2, $3, 100000, 'bank_transfer', 'DBBL-TRF-4412', 'Payment against PUR-00001', $4)
      ON CONFLICT (payment_no) DO NOTHING;
    `, [today, suppMap['BSRM Steels Ltd.'], acctMap['Dutch-Bangla Bank'], managerUser.id]);

    // 12. Expenses
    console.log('  -> Seeding Expenses...');
    await client.query(`
      INSERT INTO expenses (expense_no, expense_date, category_id, account_id, amount, description, created_by)
      VALUES
        ('EXP-00001', $1, $2, $3, 25000, 'Monthly Showroom Rent', $4),
        ('EXP-00002', $1, $5, $3, 4200, 'Electricity Bill for Current Month', $4),
        ('EXP-00003', $1, $6, $3, 35000, 'Staff Monthly Salary Payment', $4)
      ON CONFLICT (expense_no) DO NOTHING;
    `, [today, expCatMap['Rent'], acctMap['Shop Cash'], managerUser.id, expCatMap['Electricity'], expCatMap['Salary']]);

    // 13. Transfers
    console.log('  -> Seeding Transfers...');
    await client.query(`
      INSERT INTO transfers (transfer_no, transfer_date, from_account_id, to_account_id, amount, notes, created_by)
      VALUES ('TRF-00001', $1, $2, $3, 50000, 'Daily cash deposit to DBBL', $4)
      ON CONFLICT (transfer_no) DO NOTHING;
    `, [today, acctMap['Shop Cash'], acctMap['Dutch-Bangla Bank'], managerUser.id]);

    // 14. Account Transactions Ledger
    console.log('  -> Seeding Account Transactions Ledger...');
    await client.query(`
      INSERT INTO account_transactions (account_id, transaction_type, amount, balance_after, description, created_by)
      VALUES
        ($1, 'opening', 100000, 100000, 'Opening Cash Balance', $4),
        ($2, 'opening', 300000, 300000, 'Opening DBBL Balance', $4),
        ($3, 'opening', 200000, 200000, 'Opening Islami Bank Balance', $4),
        ($1, 'sale_payment', 189000, 289000, 'Sale INV-00001 Payment', $4),
        ($1, 'customer_payment', 50000, 339000, 'Customer Payment PAY-00001', $4),
        ($1, 'expense', -25000, 314000, 'Showroom Rent EXP-00001', $4),
        ($1, 'transfer_out', -50000, 264000, 'Transfer TRF-00001 to DBBL', $4),
        ($2, 'transfer_in', 50000, 350000, 'Transfer TRF-00001 from Shop Cash', $4)
      ON CONFLICT DO NOTHING;
    `, [acctMap['Shop Cash'], acctMap['Dutch-Bangla Bank'], acctMap['Islami Bank Bangladesh'], adminUser.id]);

    await client.query('COMMIT');
    console.log('✅ Full database seed completed successfully!');
    console.log('');
    console.log('====================================================');
    console.log('👥 User Accounts Created:');
    console.log('  1. Admin Account (Full access: edit/delete, backup/restore, users)');
    console.log('     Username: admin');
    console.log('     Password: Admin@1234');
    console.log('  2. Sales Manager Account (Operations: sales, purchases, payments, expenses)');
    console.log('     Username: manager');
    console.log('     Password: Manager@1234');
    console.log('  3. Cashier Account (POS & viewing)');
    console.log('     Username: cashier');
    console.log('     Password: Cashier@1234');
    console.log('====================================================');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedFull().catch(() => process.exit(1));
