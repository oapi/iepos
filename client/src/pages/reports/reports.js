/**
 * Reports Page — P&L, Sales, Purchases
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { reportsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { handleApiError } from '../../components/toast.js';

export async function renderReports(outlet) {
  setTopbarTitle(t('reports.title'));
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 7) + '-01';

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('reports.title')}</h1>
    </div>

    <!-- Report tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:0;">
      <button class="btn btn-primary report-tab" data-tab="pl" style="border-bottom-left-radius:0; border-bottom-right-radius:0;">${t('reports.profitLoss')}</button>
      <button class="btn btn-ghost report-tab" data-tab="sales">${t('reports.salesReport')}</button>
      <button class="btn btn-ghost report-tab" data-tab="purchases">${t('reports.purchaseReport')}</button>
    </div>

    <!-- Date controls -->
    <div class="filter-bar" style="margin-bottom:1.5rem;">
      <label class="form-label" style="margin:0; white-space:nowrap;">${t('reports.dateRange')}:</label>
      <input type="date" id="report-from" class="form-control" style="max-width:160px;" value="${monthStart}" />
      <input type="date" id="report-to" class="form-control" style="max-width:160px;" value="${today}" />
      <button class="btn btn-primary" id="generate-btn">📊 ${t('reports.generate')}</button>
    </div>

    <div id="report-output">
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-title">${t('reports.generate')}</div>
        <div class="empty-state-text">Select a date range and click Generate Report</div>
      </div>
    </div>
  `;

  let activeTab = 'pl';

  document.querySelectorAll('.report-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('.report-tab').forEach((b) => {
        b.className = b.dataset.tab === activeTab ? 'btn btn-primary report-tab' : 'btn btn-ghost report-tab';
      });
    });
  });

  document.getElementById('generate-btn')?.addEventListener('click', async () => {
    const from = document.getElementById('report-from')?.value;
    const to = document.getElementById('report-to')?.value;
    const output = document.getElementById('report-output');
    if (!output) return;
    output.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

    try {
      if (activeTab === 'pl') {
        const data = await reportsApi.profitLoss({ start_date: from, end_date: to });
        renderPL(output, data, from, to);
      } else if (activeTab === 'sales') {
        const data = await reportsApi.sales({ start_date: from, end_date: to });
        renderSalesReport(output, data);
      } else {
        const data = await reportsApi.purchases({ start_date: from, end_date: to });
        renderPurchasesReport(output, data);
      }
    } catch (err) { handleApiError(err); output.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">${err.message}</div></div>`; }
  });
}

function renderPL(container, data, from, to) {
  const { income, cogs, gross_profit, gross_margin_pct, expenses, net_profit, net_margin_pct } = data;
  const isProfit = net_profit >= 0;

  container.innerHTML = `
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header"><span class="card-title">${t('reports.profitLoss')}: ${formatDate(from)} — ${formatDate(to)}</span></div>

      <!-- Key metrics -->
      <div class="stats-grid" style="margin-bottom:1.5rem;">
        <div class="stat-card" style="--card-accent:#6366f1;"><div class="stat-label">${t('reports.totalSales')}</div><div class="stat-value">${formatTaka(income.total_sales)}</div><div class="stat-sub">${income.sale_count} ${t('nav.sales').toLowerCase()}</div></div>
        <div class="stat-card" style="--card-accent:#f59e0b;"><div class="stat-label">${t('reports.totalPurchases')}</div><div class="stat-value">${formatTaka(cogs.total_purchases)}</div><div class="stat-sub">${cogs.purchase_count} ${t('nav.purchases').toLowerCase()}</div></div>
        <div class="stat-card" style="--card-accent:#0ea5e9;"><div class="stat-label">${t('reports.grossProfit')}</div><div class="stat-value" style="color:${parseFloat(gross_profit) >= 0 ? 'var(--color-success)' : 'var(--color-danger)'};">${formatTaka(gross_profit)}</div><div class="stat-sub">${t('reports.grossMargin')}: ${gross_margin_pct}%</div></div>
        <div class="stat-card" style="--card-accent:#ef4444;"><div class="stat-label">${t('reports.totalExpenses')}</div><div class="stat-value" style="color:var(--color-danger);">${formatTaka(expenses.total)}</div></div>
        <div class="stat-card" style="--card-accent:${isProfit ? '#10b981' : '#ef4444'};">
          <div class="stat-label">${t('reports.netProfit')}</div>
          <div class="stat-value" style="color:${isProfit ? 'var(--color-success)' : 'var(--color-danger)'};">${formatTaka(net_profit)}</div>
          <div class="stat-sub">${t('reports.netMargin')}: ${net_margin_pct}%</div>
        </div>
      </div>

      <!-- Expense breakdown -->
      ${expenses.by_category.length > 0 ? `
      <div>
        <div style="font-size:0.875rem; font-weight:600; margin-bottom:0.75rem; color:var(--text-secondary);">${t('reports.expensesByCategory')}</div>
        <div class="table-wrapper"><table class="table"><thead><tr><th>${t('expenses.category')}</th><th class="text-right">${t('expenses.amount')}</th><th class="text-right">%</th></tr></thead>
          <tbody>${expenses.by_category.map((e) => `<tr><td>${e.category}</td><td class="text-right amount">${formatTaka(e.amount)}</td><td class="text-right text-muted" style="font-size:0.8rem;">${expenses.total > 0 ? ((e.amount / expenses.total) * 100).toFixed(1) : 0}%</td></tr>`).join('')}</tbody>
        </table></div>
      </div>` : ''}
    </div>
  `;
}

function renderSalesReport(container, data) {
  const { summary, products } = data;
  const totalSales = summary.reduce((s, r) => s + parseFloat(r.total_sales || 0), 0);

  container.innerHTML = `
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-header"><span class="card-title">${t('reports.salesReport')}</span><span style="font-weight:700; color:var(--color-primary);">${formatTaka(totalSales)}</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t('sales.date')}</th><th>${t('sales.type')}</th><th class="text-right">Count</th><th class="text-right">${t('app.total')}</th><th class="text-right">${t('app.paid')}</th><th class="text-right">${t('app.due')}</th></tr></thead>
        <tbody>${summary.map((r) => `<tr><td>${formatDate(r.period)}</td><td><span class="badge ${r.sale_type === 'cash' ? 'badge-success' : 'badge-warning'}">${t(`sales.types.${r.sale_type}`)}</span></td><td class="text-right">${r.sale_count}</td><td class="text-right amount">${formatTaka(r.total_sales)}</td><td class="text-right amount positive">${formatTaka(r.total_paid)}</td><td class="text-right amount negative">${formatTaka(r.total_due)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>
    ${products.length > 0 ? `
    <div class="card">
      <div class="card-header"><span class="card-title">Top Products</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t('products.name')}</th><th>${t('products.sku')}</th><th class="text-right">Qty Sold</th><th class="text-right">${t('app.total')}</th></tr></thead>
        <tbody>${products.slice(0, 20).map((p) => `<tr><td>${p.product_name}</td><td style="font-size:0.8rem; color:var(--text-muted);">${p.sku || '—'}</td><td class="text-right">${p.total_qty} ${p.unit}</td><td class="text-right amount">${formatTaka(p.total_amount)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>` : ''}
  `;
}

function renderPurchasesReport(container, data) {
  const { summary, by_supplier } = data;
  const total = summary.reduce((s, r) => s + parseFloat(r.total_purchases || 0), 0);

  container.innerHTML = `
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-header"><span class="card-title">${t('reports.purchaseReport')}</span><span style="font-weight:700; color:var(--color-primary);">${formatTaka(total)}</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t('purchases.date')}</th><th class="text-right">Count</th><th class="text-right">${t('app.total')}</th><th class="text-right">${t('app.paid')}</th><th class="text-right">${t('app.due')}</th></tr></thead>
        <tbody>${summary.map((r) => `<tr><td>${formatDate(r.period)}</td><td class="text-right">${r.purchase_count}</td><td class="text-right amount">${formatTaka(r.total_purchases)}</td><td class="text-right amount positive">${formatTaka(r.total_paid)}</td><td class="text-right amount negative">${formatTaka(r.total_due)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>
    ${by_supplier.length > 0 ? `
    <div class="card">
      <div class="card-header"><span class="card-title">By Supplier</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t('suppliers.name')}</th><th class="text-right">Count</th><th class="text-right">${t('app.total')}</th></tr></thead>
        <tbody>${by_supplier.map((s) => `<tr><td>${s.supplier_name}</td><td class="text-right">${s.purchase_count}</td><td class="text-right amount">${formatTaka(s.total_amount)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>` : ''}
  `;
}
