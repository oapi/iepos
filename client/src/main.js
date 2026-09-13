/**
 * CoreTrade ERP — Application Entrypoint
 */
import './styles/main.css';
import { initRouter, route, setNotFound, navigate, beforeEachRoute } from './core/router.js';
import { renderShell, getPageOutlet } from './components/shell.js';
import { store } from './core/store.js';
import { authApi } from './core/api.js';
import { t } from './core/i18n.js';

// Page modules
import { renderLogin } from './pages/auth/login.js';
import { renderDashboard } from './pages/dashboard/dashboard.js';
import { renderPOS } from './pages/pos/pos.js';
import { renderSales } from './pages/sales/sales.js';
import { renderPurchases } from './pages/purchases/purchases.js';
import { renderCustomers } from './pages/customers/customers.js';
import { renderSuppliers } from './pages/suppliers/suppliers.js';
import { renderProducts } from './pages/products/products.js';
import { renderCategories } from './pages/categories/categories.js';
import { renderInventory } from './pages/inventory/inventory.js';
import { renderPayments } from './pages/payments/payments.js';
import { renderExpenses } from './pages/expenses/expenses.js';
import { renderAccounts } from './pages/accounts/accounts.js';
import { renderReports } from './pages/reports/reports.js';
import { renderUsers } from './pages/users/users.js';
import { renderSettings } from './pages/settings/settings.js';

const appEl = document.getElementById('app');
let initialAuthChecked = false;

/**
 * Ensures shell is rendered before mounting authenticated page
 */
function wrapAuthPage(pageHandler) {
  return async (params) => {
    // If not in shell layout, render shell
    if (!document.getElementById('page-outlet')) {
      renderShell(appEl);
    }
    const outlet = getPageOutlet();
    if (outlet) {
      outlet.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
      await pageHandler(outlet, params);
    }
    document.getElementById('initial-loader')?.remove();
  };
}

// ─── Register Routes ───────────────────────────────────────

route('/login', async () => {
  renderLogin(appEl);
  document.getElementById('initial-loader')?.remove();
});

route('/', wrapAuthPage(renderDashboard));
route('/pos', wrapAuthPage(renderPOS));
route('/sales', wrapAuthPage(renderSales));
route('/purchases', wrapAuthPage(renderPurchases));
route('/customers', wrapAuthPage(renderCustomers));
route('/suppliers', wrapAuthPage(renderSuppliers));
route('/products', wrapAuthPage(renderProducts));
route('/categories', wrapAuthPage(renderCategories));
route('/inventory', wrapAuthPage(renderInventory));
route('/expenses', wrapAuthPage(renderExpenses));
route('/accounts', wrapAuthPage(renderAccounts));
route('/reports', wrapAuthPage(renderReports));
route('/users', wrapAuthPage(renderUsers));
route('/settings', wrapAuthPage(renderSettings));

// Payment routes
route('/payments/customers', wrapAuthPage(renderPayments));
route('/payments/customers/new', wrapAuthPage(renderPayments));
route('/payments/suppliers', wrapAuthPage(renderPayments));
route('/payments/suppliers/new', wrapAuthPage(renderPayments));

// 404 Handler
setNotFound(async () => {
  if (store.isAuthenticated()) {
    wrapAuthPage((outlet) => {
      outlet.innerHTML = `
        <div class="empty-state" style="padding:4rem 1rem;">
          <div class="empty-state-icon" style="font-size:3rem;">🔍</div>
          <h2 style="margin:1rem 0 0.5rem 0;">${t('error.notFound')}</h2>
          <p style="color:var(--text-muted); margin-bottom:1.5rem;">The page you are looking for does not exist.</p>
          <button class="btn btn-primary" onclick="location.hash='/'">🏠 Return to Dashboard</button>
        </div>
      `;
    })({});
  } else {
    navigate('/login');
  }
  document.getElementById('initial-loader')?.remove();
});

// ─── Route Guard ───────────────────────────────────────────

beforeEachRoute(async (path) => {
  // Check auth on first load
  if (!initialAuthChecked) {
    try {
      const { user } = await authApi.me();
      store.user = user;
    } catch {
      store.user = null;
    }
    initialAuthChecked = true;
  }

  const isAuth = store.isAuthenticated();

  // If not logged in and trying to access protected route -> go to /login
  if (!isAuth && path !== '/login') {
    navigate('/login');
    return false;
  }

  // If logged in and trying to access /login -> go to /
  if (isAuth && path === '/login') {
    navigate('/');
    return false;
  }

  // RBAC checks
  if (path === '/users' && !store.isAdmin()) {
    navigate('/');
    return false;
  }

  return true;
});

// ─── Boot Application ──────────────────────────────────────
initRouter();

// Register Service Worker for PWA / Mobile App support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
