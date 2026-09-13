# CoreTrade ERP — Islam Enterprise

> Real production ERP built for building-materials trading businesses (rod, cement, hardware).

---

## Architecture Overview

- **Backend**: Node.js + Express + PostgreSQL (`pg` pool, transactions, parameterized queries)
- **Frontend**: Vite + Vanilla JS SPA (No bloat, fast load, full bilingual English + বাংলা)
- **Security**: Argon2id password hashing, JWT authentication (httpOnly cookie + Bearer token support), Role-Based Access Control (`admin`, `manager`, `cashier`)
- **Financial Integrity**: Double-entry ledger architecture, atomic transaction handling, running balance calculation, audit logs (`stock_movements`, `account_transactions`).

---

## Features

1. **Point of Sale (POS)**: Rapid product search, real-time stock validation, instant discount calculation, cash & credit sales, and receipt printing.
2. **Products & Categories**: Product catalog, multiple pricing tiers (retail, wholesale, purchase cost), low-stock thresholds, and category management.
3. **Customers & Suppliers**: Profile management, running balance tracking, debit/credit ledgers, and payment history.
4. **Payments**: Customer collection ledger, supplier disbursement ledger, payment methods (cash, bank transfer, cheque, mobile banking), and printable receipts.
5. **Inventory**: Real-time stock movements, adjustments with reason audit, low-stock alerts, and stock valuation.
6. **Accounts & Expenses**: Cash, bank, and capital accounts, inter-account transfers, and categorized expense recording.
7. **Reports & Analytics**: Daily/monthly Profit & Loss statements, sales analysis, purchase logs, and customer/supplier ledgers.
8. **Settings & Backup**: Company branding, currency symbol, default language, password security, and 1-click full JSON database backup & restore.

---

## Database Configuration

The application is configured to connect to your PostgreSQL database using either `DATABASE_URL` or individual `DB_*` variables in `server/.env`:

```env
DATABASE_URL=postgres://raffadmin:tfpWrO7qhbI1nKSdXWzzVyoFxSHjmO40R9k2SeDQQArJt09HR0zhwkNoZb5LKbjk@pg-rw:5432/defaultdb?sslmode=require
DB_HOST=pg-rw
DB_PORT=5432
DB_NAME=defaultdb
DB_USER=raffadmin
DB_PASSWORD=tfpWrO7qhbI1nKSdXWzzVyoFxSHjmO40R9k2SeDQQArJt09HR0zhwkNoZb5LKbjk
DB_SSL=true
```

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm run install:all
```
*(or run `npm install` inside root, `server/`, and `client/`)*

### 2. Run Database Migration & Seed
```bash
npm run migrate
```
This sets up all schema tables, indexes, sequences, sample categories, demo products, accounts, and the default admin user:
- **Username**: `admin`
- **Password**: `Admin@1234` *(Please change after first login)*

### 3. Start Development Servers
Run both backend API (`:5000`) and frontend Vite dev server (`:5173`) concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# In server directory:
npm run dev

# In client directory:
npm run dev
```

### 4. Production Build & All-in-One Deployment
Build the client into `server/public`:
```bash
cd client
npm run build
```
Then start the Node.js server to serve both the API and frontend on port 5000:
```bash
cd server
npm start
```
Access the application at: `http://localhost:5000` (or `http://<your-server-ip>:5000`).
