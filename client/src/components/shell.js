/**
 * CoreTrade ERP — App Shell (Sidebar + Topbar)
 */
import { t, getLang, setLang, onLangChange } from '../core/i18n.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';
import { authApi } from '../core/api.js';
import { confirmDialog } from './modal.js';
import { showError } from './toast.js';

const navSections = [
  {
    label: () => '',
    items: [
      { key: 'dashboard', icon: '⊞', path: '/', label: () => t('nav.dashboard') },
      { key: 'pos', icon: '🛒', path: '/pos', label: () => t('nav.pos') },
    ],
  },
  {
    label: () => t('nav.sales'),
    items: [
      { key: 'sales', icon: '📋', path: '/sales', label: () => t('nav.sales') },
      { key: 'purchases', icon: '📦', path: '/purchases', label: () => t('nav.purchases') },
      { key: 'customers', icon: '👥', path: '/customers', label: () => t('nav.customers') },
      { key: 'suppliers', icon: '🏭', path: '/suppliers', label: () => t('nav.suppliers') },
    ],
  },
  {
    label: () => t('nav.payments'),
    items: [
      { key: 'customer-payments', icon: '💰', path: '/payments/customers', label: () => t('nav.customerPayments') },
      { key: 'supplier-payments', icon: '💸', path: '/payments/suppliers', label: () => t('nav.supplierPayments') },
    ],
  },
  {
    label: () => t('nav.inventory'),
    items: [
      { key: 'products', icon: '📦', path: '/products', label: () => t('nav.products') },
      { key: 'inventory', icon: '📊', path: '/inventory', label: () => t('nav.inventory') },
      { key: 'expenses', icon: '💳', path: '/expenses', label: () => t('nav.expenses') },
      { key: 'accounts', icon: '🏦', path: '/accounts', label: () => t('nav.accounts') },
    ],
  },
  {
    label: () => t('nav.reports'),
    items: [
      { key: 'reports', icon: '📈', path: '/reports', label: () => t('nav.reports') },
    ],
  },
];

const adminItems = [
  { key: 'users', icon: '👤', path: '/users', label: () => t('nav.users') },
  { key: 'settings', icon: '⚙', path: '/settings', label: () => t('nav.settings') },
];

export function renderShell(container) {
  container.innerHTML = `
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">CT</div>
        <div class="sidebar-logo-text">
          <div class="sidebar-logo-title" id="shell-app-name">${t('app.name')}</div>
          <div class="sidebar-logo-sub" id="shell-company">${t('app.company')}</div>
        </div>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <div id="sidebar-user-info" style="margin-bottom:0.5rem; font-size:0.78rem; color:var(--text-muted);"></div>
        <button class="btn btn-ghost btn-sm btn-full" id="logout-btn">
          🚪 <span id="logout-label">${t('auth.logout')}</span>
        </button>
      </div>
    </aside>

    <div class="mobile-overlay" id="mobile-overlay"></div>

    <div class="topbar" id="topbar">
      <div class="topbar-left">
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">☰</button>
        <span class="topbar-title" id="topbar-title"></span>
      </div>
      <div class="topbar-right">
        <div class="lang-switcher" role="group" aria-label="Language">
          <button class="lang-btn ${getLang() === 'en' ? 'active' : ''}" id="lang-en" data-lang="en">EN</button>
          <button class="lang-btn ${getLang() === 'bn' ? 'active' : ''}" id="lang-bn" data-lang="bn">বাং</button>
        </div>
        <div class="user-menu">
          <button class="user-btn" id="user-btn" aria-haspopup="true">
            <div class="user-avatar" id="user-avatar">?</div>
            <span id="user-name" style="font-size:0.8rem;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
            <span style="font-size:0.7rem;color:var(--text-muted);">▾</span>
          </button>
        </div>
      </div>
    </div>

    <main class="main-content" id="main-content">
      <div id="page-outlet" class="page"></div>
    </main>
  `;

  buildNav();
  bindShellEvents();
  updateUserInfo();

  // Re-render nav labels on language change
  onLangChange(() => {
    buildNav();
    document.getElementById('shell-app-name').textContent = t('app.name');
    document.getElementById('shell-company').textContent = t('app.company');
    document.getElementById('logout-label').textContent = t('auth.logout');
    updateUserInfo();
  });
}

function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  const currentPath = window.location.hash.slice(1) || '/';
  const user = store.user;

  let html = '';
  for (const section of navSections) {
    if (section.label()) {
      html += `<div class="sidebar-section-label">${section.label()}</div>`;
    }
    for (const item of section.items) {
      const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
      html += `
        <div class="nav-item ${isActive ? 'active' : ''}" data-path="${item.path}" role="link" tabindex="0">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label()}</span>
        </div>
      `;
    }
  }

  // Admin items
  if (user?.role === 'admin' || user?.role === 'manager') {
    html += `<div class="sidebar-section-label">${t('nav.settings')}</div>`;
    for (const item of adminItems) {
      if (item.key === 'users' && user?.role !== 'admin') continue;
      const isActive = currentPath === item.path;
      html += `
        <div class="nav-item ${isActive ? 'active' : ''}" data-path="${item.path}" role="link" tabindex="0">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label()}</span>
        </div>
      `;
    }
  }

  nav.innerHTML = html;

  nav.querySelectorAll('.nav-item').forEach((el) => {
    el.addEventListener('click', () => {
      navigate(el.dataset.path);
      closeMobileMenu();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') el.click();
    });
  });
}

function updateUserInfo() {
  const user = store.user;
  if (!user) return;
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const sidebarUser = document.getElementById('sidebar-user-info');
  const initials = user.full_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (avatar) avatar.textContent = initials;
  if (name) name.textContent = user.full_name;
  if (sidebarUser) sidebarUser.textContent = `${user.full_name} (${user.role})`;
}

function bindShellEvents() {
  // Language switcher
  document.getElementById('lang-en')?.addEventListener('click', () => switchLang('en'));
  document.getElementById('lang-bn')?.addEventListener('click', () => switchLang('bn'));

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);
  document.getElementById('mobile-overlay')?.addEventListener('click', closeMobileMenu);

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: t('auth.logout'),
      message: t('confirm.logout'),
      type: 'warning',
      confirmLabel: t('auth.logout'),
    });
    if (ok) {
      await authApi.logout().catch(() => {});
      localStorage.removeItem('ct_token');
      store.user = null;
      navigate('/login');
    }
  });

  // Update active nav on hash change
  window.addEventListener('hashchange', () => buildNav());
}

function switchLang(lang) {
  setLang(lang);
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

function toggleMobileMenu() {
  document.getElementById('sidebar')?.classList.toggle('mobile-open');
  document.getElementById('mobile-overlay')?.classList.toggle('active');
}

function closeMobileMenu() {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('mobile-overlay')?.classList.remove('active');
}

export function setTopbarTitle(title) {
  const el = document.getElementById('topbar-title');
  if (el) el.textContent = title;
}

export function getPageOutlet() {
  return document.getElementById('page-outlet');
}
