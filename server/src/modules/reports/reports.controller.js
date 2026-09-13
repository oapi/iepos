const { query } = require('../../config/db');

/**
 * Dashboard summary — key metrics for today and all-time
 */
const getDashboard = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // Today's totals
    const [salesRes, purchasesRes, expensesRes, paymentsRes] = await Promise.all([
      query(`SELECT
               COALESCE(SUM(total), 0) AS total_sales,
               COALESCE(SUM(paid), 0) AS total_paid,
               COUNT(*) AS sale_count
             FROM sales
             WHERE sale_date = $1 AND status = 'completed'`, [today]),
      query(`SELECT COALESCE(SUM(total), 0) AS total_purchases, COUNT(*) AS purchase_count
             FROM purchases WHERE purchase_date = $1 AND status = 'completed'`, [today]),
      query(`SELECT COALESCE(SUM(amount), 0) AS total_expenses
             FROM expenses WHERE expense_date = $1`, [today]),
      query(`SELECT COALESCE(SUM(amount), 0) AS received
             FROM customer_payments WHERE payment_date = $1`, [today]),
    ]);

    // All-time aggregates
    const [accountsRes, customerDueRes, supplierDueRes, lowStockRes] = await Promise.all([
      query(`SELECT
               type,
               COALESCE(SUM(balance), 0) AS total
             FROM accounts WHERE is_active = true GROUP BY type`),
      query(`SELECT COALESCE(SUM(balance), 0) AS total FROM customers WHERE balance > 0`),
      query(`SELECT COALESCE(SUM(balance), 0) AS total FROM suppliers WHERE balance > 0`),
      query(`SELECT COUNT(*) FROM products WHERE is_active = true AND current_stock <= low_stock_alert`),
    ]);

    // Recent sales (last 5)
    const { rows: recentSales } = await query(
      `SELECT s.invoice_no, s.sale_date, s.total, s.sale_type, c.name AS customer_name
       FROM sales s LEFT JOIN customers c ON s.customer_id = c.id
       WHERE s.status = 'completed'
       ORDER BY s.created_at DESC LIMIT 5`
    );

    // Monthly sales chart data (last 30 days)
    const { rows: salesChart } = await query(
      `SELECT sale_date::DATE AS date, COALESCE(SUM(total), 0) AS amount
       FROM sales
       WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days'
         AND status = 'completed'
       GROUP BY sale_date::DATE
       ORDER BY date`
    );

    // Account balances by type
    const accountsByType = {};
    accountsRes.rows.forEach((r) => {
      accountsByType[r.type] = parseFloat(r.total);
    });

    const todaySales = parseFloat(salesRes.rows[0].total_sales);
    const todayPurchases = parseFloat(purchasesRes.rows[0].total_purchases);
    const todayExpenses = parseFloat(expensesRes.rows[0].total_expenses);
    // Rough profit: sales - cost of goods - expenses
    const todayProfit = todaySales - todayExpenses;

    res.json({
      today: {
        sales: todaySales,
        purchases: todayPurchases,
        expenses: todayExpenses,
        profit: todayProfit,
        payments_received: parseFloat(paymentsRes.rows[0].received),
        sale_count: parseInt(salesRes.rows[0].sale_count),
        purchase_count: parseInt(purchasesRes.rows[0].purchase_count),
      },
      accounts: accountsByType,
      total_cash: accountsByType.cash || 0,
      total_bank: accountsByType.bank || 0,
      total_available: (accountsByType.cash || 0) + (accountsByType.bank || 0),
      customer_due: parseFloat(customerDueRes.rows[0].total),
      supplier_due: parseFloat(supplierDueRes.rows[0].total),
      low_stock_count: parseInt(lowStockRes.rows[0].count),
      recent_sales: recentSales,
      sales_chart: salesChart,
    });
  } catch (err) { next(err); }
};

/**
 * Profit & Loss report for a date range
 */
const getProfitLoss = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const [salesRes, purchasesRes, expenseRes, expCatRes, paymentReceivedRes, paymentMadeRes] = await Promise.all([
      query(`SELECT
               COALESCE(SUM(total), 0) AS total_sales,
               COALESCE(SUM(paid), 0) AS total_collected,
               COALESCE(SUM(due), 0) AS total_credit,
               COUNT(*) AS sale_count
             FROM sales
             WHERE sale_date BETWEEN $1 AND $2 AND status = 'completed'`,
        [start_date, end_date]),

      query(`SELECT
               COALESCE(SUM(total), 0) AS total_purchases,
               COUNT(*) AS purchase_count
             FROM purchases
             WHERE purchase_date BETWEEN $1 AND $2 AND status = 'completed'`,
        [start_date, end_date]),

      query(`SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM expenses
             WHERE expense_date BETWEEN $1 AND $2`, [start_date, end_date]),

      query(`SELECT ec.name AS category, COALESCE(SUM(e.amount), 0) AS amount
             FROM expenses e
             LEFT JOIN expense_categories ec ON e.category_id = ec.id
             WHERE e.expense_date BETWEEN $1 AND $2
             GROUP BY ec.name ORDER BY amount DESC`,
        [start_date, end_date]),

      query(`SELECT COALESCE(SUM(amount), 0) AS total FROM customer_payments
             WHERE payment_date BETWEEN $1 AND $2`, [start_date, end_date]),

      query(`SELECT COALESCE(SUM(amount), 0) AS total FROM supplier_payments
             WHERE payment_date BETWEEN $1 AND $2`, [start_date, end_date]),
    ]);

    const totalSales = parseFloat(salesRes.rows[0].total_sales);
    const totalPurchases = parseFloat(purchasesRes.rows[0].total_purchases);
    const totalExpenses = parseFloat(expenseRes.rows[0].total_expenses);
    const grossProfit = totalSales - totalPurchases;
    const netProfit = grossProfit - totalExpenses;

    res.json({
      period: { start_date, end_date },
      income: {
        total_sales: totalSales,
        total_collected: parseFloat(salesRes.rows[0].total_collected),
        total_credit: parseFloat(salesRes.rows[0].total_credit),
        sale_count: parseInt(salesRes.rows[0].sale_count),
      },
      cogs: {
        total_purchases: totalPurchases,
        purchase_count: parseInt(purchasesRes.rows[0].purchase_count),
      },
      gross_profit: grossProfit,
      gross_margin_pct: totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(2) : 0,
      expenses: {
        total: totalExpenses,
        by_category: expCatRes.rows,
      },
      net_profit: netProfit,
      net_margin_pct: totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(2) : 0,
      payments: {
        received: parseFloat(paymentReceivedRes.rows[0].total),
        made: parseFloat(paymentMadeRes.rows[0].total),
      },
    });
  } catch (err) { next(err); }
};

/**
 * Sales report with daily breakdown
 */
const getSalesReport = async (req, res, next) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const dateExpr = group_by === 'month'
      ? `DATE_TRUNC('month', sale_date)`
      : `sale_date::DATE`;

    const { rows } = await query(
      `SELECT
         ${dateExpr} AS period,
         sale_type,
         COUNT(*) AS sale_count,
         SUM(total) AS total_sales,
         SUM(paid) AS total_paid,
         SUM(due) AS total_due,
         SUM(discount) AS total_discount
       FROM sales
       WHERE sale_date BETWEEN $1 AND $2 AND status = 'completed'
       GROUP BY period, sale_type
       ORDER BY period`,
      [start_date, end_date]
    );

    // Product-level breakdown
    const { rows: productRows } = await query(
      `SELECT
         p.name AS product_name, p.sku, p.unit,
         SUM(si.qty) AS total_qty,
         SUM(si.total) AS total_amount
       FROM sale_items si
       JOIN products p ON si.product_id = p.id
       JOIN sales s ON si.sale_id = s.id
       WHERE s.sale_date BETWEEN $1 AND $2 AND s.status = 'completed'
       GROUP BY p.id, p.name, p.sku, p.unit
       ORDER BY total_amount DESC`,
      [start_date, end_date]
    );

    res.json({ summary: rows, products: productRows });
  } catch (err) { next(err); }
};

/**
 * Purchase report
 */
const getPurchaseReport = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const { rows: summary } = await query(
      `SELECT
         purchase_date::DATE AS period,
         COUNT(*) AS purchase_count,
         SUM(total) AS total_purchases,
         SUM(paid) AS total_paid,
         SUM(due) AS total_due
       FROM purchases
       WHERE purchase_date BETWEEN $1 AND $2 AND status = 'completed'
       GROUP BY period ORDER BY period`,
      [start_date, end_date]
    );

    const { rows: bySupplier } = await query(
      `SELECT
         s.name AS supplier_name,
         COUNT(*) AS purchase_count,
         SUM(p.total) AS total_amount
       FROM purchases p
       JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.purchase_date BETWEEN $1 AND $2 AND p.status = 'completed'
       GROUP BY s.id, s.name ORDER BY total_amount DESC`,
      [start_date, end_date]
    );

    res.json({ summary, by_supplier: bySupplier });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getProfitLoss, getSalesReport, getPurchaseReport };
