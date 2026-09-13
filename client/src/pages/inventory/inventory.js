/**
 * Inventory Page — Movements, Adjust, Low Stock, Summary
 */
import { t, formatTaka, formatDate, formatDateTime } from '../../core/i18n.js';
import { inventoryApi, productsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

export async function renderInventory(outlet) {
  setTopbarTitle(t('inventory.title'));
  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('inventory.title')}</h1>
      <button class="btn btn-primary" id="adjust-btn">⚖ ${t('inventory.adjust')}</button>
    </div>

    <!-- Tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border);">
      <button class="btn btn-primary inv-tab" data-tab="movements">${t('inventory.movements')}</button>
      <button class="btn btn-ghost inv-tab" data-tab="lowstock">⚠ ${t('inventory.lowStock')}</button>
      <button class="btn btn-ghost inv-tab" data-tab="summary">📊 ${t('inventory.summary')}</button>
    </div>

    <div id="inv-output"><div class="loading-spinner"><div class="spinner"></div></div></div>
  `;

  let activeTab = 'movements';

  const switchTab = async (tab) => {
    activeTab = tab;
    document.querySelectorAll('.inv-tab').forEach((b) => {
      b.className = b.dataset.tab === tab ? 'btn btn-primary inv-tab' : 'btn btn-ghost inv-tab';
    });
    const output = document.getElementById('inv-output');
    if (!output) return;
    output.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
    try {
      if (tab === 'movements') await renderMovements(output);
      if (tab === 'lowstock') await renderLowStock(output);
      if (tab === 'summary') await renderSummary(output);
    } catch (err) { handleApiError(err); }
  };

  document.querySelectorAll('.inv-tab').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  await switchTab('movements');

  document.getElementById('adjust-btn')?.addEventListener('click', () => openAdjustModal());
}

async function renderMovements(container) {
  const { movements, total } = await inventoryApi.movements({ limit: 100 });
  if (!movements.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t('app.noData')}</div></div>`;
    return;
  }
  container.innerHTML = `
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('app.date')}</th>
          <th>${t('inventory.product')}</th>
          <th>${t('inventory.movementType')}</th>
          <th class="text-right">${t('inventory.qty')}</th>
          <th class="text-right">${t('inventory.balanceAfter')}</th>
          <th>${t('inventory.reference')}</th>
          <th>${t('users.fullName')}</th>
        </tr></thead>
        <tbody>
          ${movements.map((m) => `
            <tr>
              <td style="font-size:0.8rem;">${formatDateTime(m.created_at)}</td>
              <td>
                <div style="font-weight:500;">${m.product_name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${m.sku || ''}</div>
              </td>
              <td><span class="badge ${m.movement_type.includes('in') || m.movement_type === 'purchase' ? 'badge-success' : m.movement_type === 'sale' ? 'badge-info' : 'badge-warning'}">
                ${t(`inventory.movementTypes.${m.movement_type}`) || m.movement_type}
              </span></td>
              <td class="text-right">
                <span class="${parseFloat(m.qty) > 0 ? 'text-success' : 'text-danger'}" style="font-weight:600;">
                  ${parseFloat(m.qty) > 0 ? '+' : ''}${m.qty} ${m.unit}
                </span>
              </td>
              <td class="text-right">${m.balance_after} ${m.unit}</td>
              <td style="font-size:0.8rem; color:var(--text-muted);">${m.reference_type} ${m.notes ? `· ${m.notes}` : ''}</td>
              <td style="font-size:0.8rem; color:var(--text-muted);">${m.created_by_name || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function renderLowStock(container) {
  const { products, count } = await inventoryApi.lowStock();
  if (!products.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title" style="color:var(--color-success);">All stock levels are adequate</div></div>`;
    return;
  }
  container.innerHTML = `
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e; font-weight:500;">
      ⚠️ ${t('dashboard.lowStockItems').replace('{n}', count)}
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('products.name')}</th>
          <th>${t('products.category')}</th>
          <th class="text-right">${t('inventory.qty')}</th>
          <th class="text-right">${t('products.lowStockAlert')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody>
          ${products.map((p) => `
            <tr>
              <td>
                <div style="font-weight:500;">${p.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${p.sku || ''}</div>
              </td>
              <td>${p.category_name || '—'}</td>
              <td class="text-right"><span class="text-warning font-semibold">${p.current_stock} ${p.unit}</span></td>
              <td class="text-right text-muted">${p.low_stock_alert} ${p.unit}</td>
              <td>
                <button class="btn btn-sm btn-success adj-btn" data-id="${p.id}" data-name="${p.name}">+ ${t('inventory.adjustIn')}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.querySelectorAll('.adj-btn').forEach((b) => b.addEventListener('click', () => openAdjustModal(b.dataset.id, b.dataset.name)));
}

async function renderSummary(container) {
  const { products, totals } = await inventoryApi.summary();

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:1.5rem; grid-template-columns:repeat(2,1fr);">
      <div class="stat-card" style="--card-accent:#6366f1;"><div class="stat-label">${t('inventory.costValue')}</div><div class="stat-value">${formatTaka(totals.stock_value_cost)}</div></div>
      <div class="stat-card" style="--card-accent:#10b981;"><div class="stat-label">${t('inventory.retailValue')}</div><div class="stat-value">${formatTaka(totals.stock_value_retail)}</div></div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('products.name')}</th>
          <th>${t('products.category')}</th>
          <th class="text-right">${t('inventory.qty')}</th>
          <th class="text-right">${t('products.purchaseCost')}</th>
          <th class="text-right">${t('products.retailPrice')}</th>
          <th class="text-right">${t('inventory.costValue')}</th>
          <th class="text-right">${t('inventory.retailValue')}</th>
        </tr></thead>
        <tbody>
          ${products.map((p) => `
            <tr>
              <td><div style="font-weight:500;">${p.name}</div></td>
              <td>${p.category_name || '—'}</td>
              <td class="text-right">${p.current_stock} ${p.unit}</td>
              <td class="text-right amount">${formatTaka(p.purchase_cost)}</td>
              <td class="text-right amount">${formatTaka(p.retail_price)}</td>
              <td class="text-right amount">${formatTaka(p.stock_value_cost)}</td>
              <td class="text-right amount positive">${formatTaka(p.stock_value_retail)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-right" style="font-weight:700;">Total</td>
            <td class="text-right amount" style="font-weight:700;">${formatTaka(totals.stock_value_cost)}</td>
            <td class="text-right amount positive" style="font-weight:700;">${formatTaka(totals.stock_value_retail)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

async function openAdjustModal(productId = null, productName = '') {
  let products = [];
  try { const d = await productsApi.list({ limit: 500 }); products = d.products; } catch {}

  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group">
      <label class="form-label">${t('inventory.product')} *</label>
      <select name="product_id" class="form-control" required ${productId ? 'disabled' : ''}>
        <option value="">${t('app.selectOption')}</option>
        ${products.map((p) => `<option value="${p.id}" ${p.id === productId ? 'selected' : ''}>${p.name} — ${t('app.balance')}: ${p.current_stock} ${p.unit}</option>`).join('')}
        ${productId && !products.find((p) => p.id === productId) ? `<option value="${productId}" selected>${productName}</option>` : ''}
      </select>
      ${productId ? `<input type="hidden" name="product_id" value="${productId}" />` : ''}
    </div>
    <div class="form-group">
      <label class="form-label">${t('inventory.movementType')} *</label>
      <div style="display:flex; gap:0.5rem;">
        <label class="form-check" style="flex:1; padding:0.75rem; background:var(--bg-base); border:1px solid var(--border); border-radius:0.5rem; cursor:pointer;">
          <input type="radio" name="adjustment_type" value="adjustment_in" checked />
          <span>↑ ${t('inventory.adjustIn')}</span>
        </label>
        <label class="form-check" style="flex:1; padding:0.75rem; background:var(--bg-base); border:1px solid var(--border); border-radius:0.5rem; cursor:pointer;">
          <input type="radio" name="adjustment_type" value="adjustment_out" />
          <span>↓ ${t('inventory.adjustOut')}</span>
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t('inventory.qty')} *</label>
      <input name="qty" type="number" min="0.001" step="0.001" class="form-control" required />
    </div>
    <div class="form-group">
      <label class="form-label">${t('inventory.reason')}</label>
      <textarea name="notes" class="form-control" rows="2"></textarea>
    </div>
  `;

  showModal({
    title: t('inventory.adjust'), body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.confirm'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (!data.product_id || !data.qty) { showError('Product and quantity are required'); return; }
        try { await inventoryApi.adjust(data); showSuccess(t('inventory.adjustSuccess')); close(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}
