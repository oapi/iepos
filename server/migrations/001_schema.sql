-- ============================================================
-- CoreTrade ERP — Initial Database Schema
-- Islam Enterprise
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username      VARCHAR(50) UNIQUE NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'cashier'
                  CHECK (role IN ('admin', 'manager', 'cashier')),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CATEGORIES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(100) NOT NULL,
    name_bn    VARCHAR(200),
    slug       VARCHAR(100) UNIQUE NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRODUCTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
    sku              VARCHAR(50) UNIQUE,
    name             VARCHAR(200) NOT NULL,
    name_bn          VARCHAR(400),
    brand            VARCHAR(100),
    size             VARCHAR(50),
    unit             VARCHAR(50) NOT NULL DEFAULT 'pcs',
    -- Pricing (stored as NUMERIC to avoid float issues)
    retail_price     NUMERIC(15,2) NOT NULL DEFAULT 0,
    wholesale_price  NUMERIC(15,2) NOT NULL DEFAULT 0,
    purchase_cost    NUMERIC(15,2) NOT NULL DEFAULT 0,
    -- Stock
    current_stock    NUMERIC(15,3) NOT NULL DEFAULT 0,
    low_stock_alert  NUMERIC(15,3) NOT NULL DEFAULT 5,
    -- Flags
    is_active        BOOLEAN NOT NULL DEFAULT true,
    notes            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('simple', name));

-- ─── CUSTOMERS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name           VARCHAR(200) NOT NULL,
    phone          VARCHAR(20),
    address        TEXT,
    -- Running balance: positive = customer owes us
    balance        NUMERIC(15,2) NOT NULL DEFAULT 0,
    credit_limit   NUMERIC(15,2) NOT NULL DEFAULT 0,
    is_active      BOOLEAN NOT NULL DEFAULT true,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ─── SUPPLIERS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(200) NOT NULL,
    phone      VARCHAR(20),
    address    TEXT,
    -- Running balance: positive = we owe them
    balance    NUMERIC(15,2) NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    notes      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- ─── ACCOUNTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(100) NOT NULL,
    name_bn    VARCHAR(200),
    type       VARCHAR(20) NOT NULL CHECK (type IN ('cash', 'bank', 'capital')),
    balance    NUMERIC(15,2) NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    notes      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SALES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no     VARCHAR(30) UNIQUE NOT NULL,
    sale_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    sale_type      VARCHAR(20) NOT NULL DEFAULT 'cash'
                   CHECK (sale_type IN ('cash', 'credit', 'wholesale')),
    customer_id    UUID REFERENCES customers(id) ON DELETE RESTRICT,
    account_id     UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    subtotal       NUMERIC(15,2) NOT NULL DEFAULT 0,
    discount       NUMERIC(15,2) NOT NULL DEFAULT 0,
    total          NUMERIC(15,2) NOT NULL DEFAULT 0,
    paid           NUMERIC(15,2) NOT NULL DEFAULT 0,
    due            NUMERIC(15,2) NOT NULL DEFAULT 0,
    status         VARCHAR(20) NOT NULL DEFAULT 'completed'
                   CHECK (status IN ('completed', 'voided')),
    void_reason    TEXT,
    notes          TEXT,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoice_no);

-- ─── SALE ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sale_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id     UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(200) NOT NULL, -- denormalized snapshot
    unit        VARCHAR(50) NOT NULL,
    qty         NUMERIC(15,3) NOT NULL,
    unit_price  NUMERIC(15,2) NOT NULL,
    discount    NUMERIC(15,2) NOT NULL DEFAULT 0,
    total       NUMERIC(15,2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);

-- ─── PURCHASES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no    VARCHAR(30) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    supplier_id   UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    account_id    UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    subtotal      NUMERIC(15,2) NOT NULL DEFAULT 0,
    discount      NUMERIC(15,2) NOT NULL DEFAULT 0,
    total         NUMERIC(15,2) NOT NULL DEFAULT 0,
    paid          NUMERIC(15,2) NOT NULL DEFAULT 0,
    due           NUMERIC(15,2) NOT NULL DEFAULT 0,
    status        VARCHAR(20) NOT NULL DEFAULT 'completed'
                  CHECK (status IN ('completed', 'voided')),
    void_reason   TEXT,
    notes         TEXT,
    created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);

-- ─── PURCHASE ITEMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_items (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id  UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(200) NOT NULL,
    unit         VARCHAR(50) NOT NULL,
    qty          NUMERIC(15,3) NOT NULL,
    unit_cost    NUMERIC(15,2) NOT NULL,
    discount     NUMERIC(15,2) NOT NULL DEFAULT 0,
    total        NUMERIC(15,2) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON purchase_items(purchase_id);

-- ─── STOCK MOVEMENTS (Immutable audit log) ────────────────
CREATE TABLE IF NOT EXISTS stock_movements (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    movement_type VARCHAR(30) NOT NULL
                  CHECK (movement_type IN (
                    'purchase', 'sale', 'return_in', 'return_out',
                    'adjustment_in', 'adjustment_out', 'opening'
                  )),
    qty          NUMERIC(15,3) NOT NULL, -- positive = in, negative = out
    balance_after NUMERIC(15,3) NOT NULL,
    reference_id  UUID,       -- sale_id or purchase_id
    reference_type VARCHAR(30), -- 'sale' | 'purchase' | 'adjustment'
    notes        TEXT,
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(created_at);

-- ─── CUSTOMER PAYMENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_payments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_no  VARCHAR(30) UNIQUE NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    account_id  UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount      NUMERIC(15,2) NOT NULL,
    method      VARCHAR(20) NOT NULL DEFAULT 'cash'
                CHECK (method IN ('cash', 'bank_transfer', 'cheque', 'mobile_banking')),
    reference   VARCHAR(100),
    notes       TEXT,
    created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_payments_customer ON customer_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_date ON customer_payments(payment_date);

-- ─── SUPPLIER PAYMENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_payments (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_no   VARCHAR(30) UNIQUE NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    supplier_id  UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    account_id   UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount       NUMERIC(15,2) NOT NULL,
    method       VARCHAR(20) NOT NULL DEFAULT 'cash'
                 CHECK (method IN ('cash', 'bank_transfer', 'cheque', 'mobile_banking')),
    reference    VARCHAR(100),
    notes        TEXT,
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_payments_supplier ON supplier_payments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_payments_date ON supplier_payments(payment_date);

-- ─── ACCOUNT TRANSACTIONS ────────────────────────────────
CREATE TABLE IF NOT EXISTS account_transactions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id     UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    transaction_type VARCHAR(30) NOT NULL
                   CHECK (transaction_type IN (
                     'sale_payment', 'purchase_payment', 'customer_payment',
                     'supplier_payment', 'expense', 'transfer_in', 'transfer_out',
                     'deposit', 'withdrawal', 'opening'
                   )),
    amount         NUMERIC(15,2) NOT NULL, -- positive = in, negative = out
    balance_after  NUMERIC(15,2) NOT NULL,
    reference_id   UUID,
    reference_type VARCHAR(30),
    description    TEXT,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acct_txns_account ON account_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_acct_txns_date ON account_transactions(created_at);

-- ─── TRANSFERS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transfers (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_no    VARCHAR(30) UNIQUE NOT NULL,
    transfer_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    from_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    to_account_id   UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount         NUMERIC(15,2) NOT NULL,
    notes          TEXT,
    created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT different_accounts CHECK (from_account_id <> to_account_id)
);

-- ─── EXPENSES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_categories (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(100) NOT NULL,
    name_bn    VARCHAR(200),
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_no   VARCHAR(30) UNIQUE NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category_id  UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
    account_id   UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount       NUMERIC(15,2) NOT NULL,
    description  TEXT NOT NULL,
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);

-- ─── INVOICE SEQUENCES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_sequences (
    prefix     VARCHAR(10) PRIMARY KEY,
    last_num   BIGINT NOT NULL DEFAULT 0,
    pad_length INT NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO invoice_sequences (prefix, last_num) VALUES
    ('INV', 0),
    ('PUR', 0),
    ('PAY', 0),
    ('EXP', 0),
    ('TRF', 0)
ON CONFLICT (prefix) DO NOTHING;

-- ─── SETTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    key        VARCHAR(100) PRIMARY KEY,
    value      TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
    ('company_name', 'Islam Enterprise'),
    ('company_address', 'Bangladesh'),
    ('company_phone', ''),
    ('company_email', ''),
    ('currency_symbol', '৳'),
    ('default_language', 'en'),
    ('invoice_prefix', 'INV'),
    ('purchase_prefix', 'PUR'),
    ('low_stock_notify', 'true')
ON CONFLICT (key) DO NOTHING;

-- ─── Updated-at trigger function ─────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'categories', 'products', 'customers',
        'suppliers', 'accounts', 'sales', 'purchases',
        'expenses', 'settings'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %s;
             CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %s
             FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
            tbl, tbl, tbl, tbl
        );
    END LOOP;
END;
$$;
