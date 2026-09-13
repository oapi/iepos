/**
 * Dashboard Page
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { reportsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { handleApiError } from '../../components/toast.js';
import { navigate } from '../../core/router.js';

export async function renderDashboard(outlet) {
  setTopbarTitle(t('dashboard.title'));

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('dashboard.title')}</h1>
      <span style="color:var(--text-muted); font-size:0.8rem;" id="dash-date"></span>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions" id="quick-actions">
      ${renderQuickActions()}
    </div>

    <!-- Stats Grid (skeleton) -->
    <div class="stats-grid" id="stats-grid">
      ${[...Array(8)].map(() => `
        <div class="stat-card">
          <div class="skeleton" style="height:14px; width:60%; margin-bottom:12px; border-radius:4px;"></div>
          <div class="skeleton" style="height:32px; width:80%; border-radius:4px;"></div>
        </div>
      `).join('')}
    </div>

    <!-- Bottom row -->
    <div class="grid-2" style="gap:1.5rem;">
      <div class="card" id="recent-sales-card">
        <div class="card-header">
          <span class="card-title">${t('dashboard.recentSales')}</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/sales')">${t('app.view')}</button>
        </div>
        <div class="loading-spinner"><div class="spinner"></div></div>
      </div>

      <div class="card" id="low-stock-card">
        <div class="card-header">
          <span class="card-title">${t('dashboard.lowStockAlert')}</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/inventory')">${t('inventory.lowStock')}</button>
        </div>
        <div class="loading-spinner"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  // Set today's date
  document.getElementById('dash-date').textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Bind quick action navigation
  document.querySelectorAll('[data-qa-path]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.qaPath));
  });

  try {
    const { today, customer_due, supplier_due, total_cash, total_bank,
            total_available, low_stock_count, recent_sales } = await reportsApi.dashboard();

    // Render stats
    const statsEl = document.getElementById('stats-grid');
    statsEl.innerHTML = `
      ${statCard(t('dashboard.todaySales'), formatTaka(today.sales), `${today.sale_count} ${t('nav.sales')}`, '#6366f1', '💰')}
      ${statCard(t('dashboard.todayPurchases'), formatTaka(today.purchases), `${today.purchase_count} ${t('nav.purchases')}`, '#f59e0b', '📦')}
      ${statCard(t('dashboard.todayExpenses'), formatTaka(today.expenses), '', '#ef4444', '💳')}
      ${statCard(t('dashboard.todayProfit'), formatTaka(today.profit), '', today.profit >= 0 ? '#10b981' : '#ef4444', '📈')}
      ${statCard(t('dashboard.cashBalance'), formatTaka(total_cash), '', '#10b981', '💵')}
      ${statCard(t('dashboard.bankBalance'), formatTaka(total_bank), t('dashboard.totalAvailable') + ': ' + formatTaka(total_available), '#0ea5e9', '🏦')}
      ${statCard(t('dashboard.customerDue'), formatTaka(customer_due), '', '#f59e0b', '👥')}
      ${statCard(t('dashboard.supplierDue'), formatTaka(supplier_due), '', '#ef4444', '🏭')}
    `;

    // Recent sales
    const rsEl = document.getElementById('recent-sales-card');
    rsEl.innerHTML = `
      <div class="card-header">
        <span class="card-title">${t('dashboard.recentSales')}</span>
        <button class="btn btn-ghost btn-sm" id="view-all-sales">${t('app.view')}</button>
      </div>
      ${recent_sales.length === 0 ? `
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">${t('dashboard.noRecentSales')}</div>
        </div>
      ` : `
        <table class="table">
          <thead><tr>
            <th>${t('sales.invoice')}</th>
            <th>${t('sales.customer')}</th>
            <th>${t('sales.type')}</th>
            <th class="text-right">${t('sales.total')}</th>
          </tr></thead>
          <tbody>
            ${recent_sales.map((s) => `
              <tr>
                <td style="font-family:monospace; font-size:0.8rem;">${s.invoice_no}</td>
                <td>${s.customer_name || '—'}</td>
                <td><span class="badge ${s.sale_type === 'cash' ? 'badge-success' : 'badge-warning'}">
                  ${t(`sales.types.${s.sale_type}`)}
                </span></td>
                <td class="text-right amount">${formatTaka(s.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    `;

    document.getElementById('view-all-sales')?.addEventListener('click', () => navigate('/sales'));

    // Low stock
    const lowStockEl = document.getElementById('low-stock-card');
    if (low_stock_count === 0) {
      lowStockEl.innerHTML = `
        <div class="card-header"><span class="card-title">${t('dashboard.lowStockAlert')}</span></div>
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-title" style="color:var(--color-success);">All stock levels OK</div>
        </div>
      `;
    } else {
      lowStockEl.innerHTML = `
        <div class="card-header">
          <span class="card-title">${t('dashboard.lowStockAlert')}</span>
          <span class="badge badge-warning">${t('dashboard.lowStockItems').replace('{n}', low_stock_count)}</span>
        </div>
        <div style="padding:1rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">⚠️</div>
          <div style="font-weight:600; color:var(--color-warning); margin-bottom:1rem;">
            ${t('dashboard.lowStockItems').replace('{n}', low_stock_count)}
          </div>
          <button class="btn btn-warning btn-sm" id="view-low-stock">${t('dashboard.viewLowStock')}</button>
        </div>
      `;
      document.getElementById('view-low-stock')?.addEventListener('click', () => navigate('/inventory?tab=low-stock'));
    }

  } catch (err) {
    handleApiError(err);
  }
}

function statCard(label, value, sub, accent, icon) {
  return `
    <div class="stat-card" style="--card-accent:${accent};">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
      <div class="stat-icon">${icon}</div>
    </div>
  `;
}

function renderQuickActions() {
  const actions = [
    { icon: '🛒', label: () => t('quick.newSale'), path: '/pos' },
    { icon: '📦', label: () => t('quick.newPurchase'), path: '/purchases/new' },
    { icon: '💰', label: () => t('quick.receivePayment'), path: '/payments/customers/new' },
    { icon: '💸', label: () => t('quick.paySupplier'), path: '/payments/suppliers/new' },
    { icon: '💳', label: () => t('quick.addExpense'), path: '/expenses/new' },
    { icon: '📦', label: () => t('quick.addProduct'), path: '/products/new' },
  ];

  return actions.map((a) => `
    <button class="quick-action-btn" data-qa-path="${a.path}">
      <span class="qa-icon">${a.icon}</span>
      ${a.label()}
    </button>
  `).join('');
}
