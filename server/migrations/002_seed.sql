-- ============================================================
-- CoreTrade ERP — Seed Data
-- Islam Enterprise
-- ============================================================

-- Default admin user (password: Admin@1234 — CHANGE IMMEDIATELY)
-- Argon2id hash of "Admin@1234"
INSERT INTO users (id, username, full_name, password_hash, role)
VALUES (
    uuid_generate_v4(),
    'admin',
    'Administrator',
    '$argon2id$v=19$m=65536,t=3,p=4$placeholder_will_be_replaced_by_seed_script',
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- ─── Product Categories ───────────────────────────────────
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

-- ─── Default Accounts ────────────────────────────────────
INSERT INTO accounts (name, name_bn, type, balance, is_default) VALUES
    ('Shop Cash', 'দোকান ক্যাশ', 'cash', 0, true),
    ('Dutch-Bangla Bank', 'ডাচ-বাংলা ব্যাংক', 'bank', 0, false),
    ('Capital', 'মূলধন', 'capital', 0, false)
ON CONFLICT DO NOTHING;

-- ─── Expense Categories ───────────────────────────────────
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

-- ─── Sample Products (building materials) ─────────────────
-- These are just demonstration products — replace with real inventory
DO $$
DECLARE
    rod_id UUID;
    cement_id UUID;
    hardware_id UUID;
BEGIN
    SELECT id INTO rod_id FROM categories WHERE slug = 'rod-steel';
    SELECT id INTO cement_id FROM categories WHERE slug = 'cement';
    SELECT id INTO hardware_id FROM categories WHERE slug = 'hardware';

    INSERT INTO products (category_id, sku, name, name_bn, brand, size, unit, retail_price, wholesale_price, purchase_cost, current_stock, low_stock_alert)
    VALUES
        (rod_id, 'ROD-8MM', '8mm Deformed Bar', '৮মিমি রড', 'BSRM', '8mm', 'ton', 95000, 94000, 90000, 10, 2),
        (rod_id, 'ROD-10MM', '10mm Deformed Bar', '১০মিমি রড', 'BSRM', '10mm', 'ton', 94500, 93500, 89500, 15, 2),
        (rod_id, 'ROD-12MM', '12mm Deformed Bar', '১২মিমি রড', 'BSRM', '12mm', 'ton', 94000, 93000, 89000, 20, 2),
        (rod_id, 'ROD-16MM', '16mm Deformed Bar', '১৬মিমি রড', 'BSRM', '16mm', 'ton', 93500, 92500, 88500, 10, 2),
        (cement_id, 'CEM-SHAH-50', 'Shah Cement (50 kg)', 'শাহ সিমেন্ট (৫০ কেজি)', 'Shah Cement', '50 kg', 'bag', 550, 540, 510, 200, 20),
        (cement_id, 'CEM-LAFARGE-50', 'Lafarge Cement (50 kg)', 'লাফার্জ সিমেন্ট (৫০ কেজি)', 'Lafarge', '50 kg', 'bag', 560, 550, 520, 150, 20),
        (cement_id, 'CEM-FRESH-50', 'Fresh Cement (50 kg)', 'ফ্রেশ সিমেন্ট (৫০ কেজি)', 'Fresh Cement', '50 kg', 'bag', 540, 530, 500, 180, 20),
        (hardware_id, 'HW-BOLT-M12', 'M12 Bolt (per pcs)', 'এম১২ বোল্ট (পিস)', NULL, 'M12', 'pcs', 25, 22, 18, 500, 50),
        (hardware_id, 'HW-NUT-M12', 'M12 Nut (per pcs)', 'এম১২ নাট (পিস)', NULL, 'M12', 'pcs', 12, 10, 8, 1000, 100)
    ON CONFLICT (sku) DO NOTHING;
END;
$$;
