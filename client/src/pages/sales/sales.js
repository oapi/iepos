/**
 * Sales List Page
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { salesApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';
import { navigate } from '../../core/router.js';

let page = 1;
let filters = { start_date: '', end_date: '', sale_type: '' };

export async function renderSales(outlet) {
  setTopbarTitle(t('sales.title'));
  const today = new Date().toISOString().slice(0, 10);

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('sales.title')}</h1>
      <button class="btn btn-primary" onclick="location.hash='/pos'">🛒 ${t('quick.newSale')}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="sale-from" class="form-control" style="max-width:160px;" value="${today}" />
      <input type="date" id="sale-to" class="form-control" style="max-width:160px;" value="${today}" />
      <select id="sale-type-filter" class="form-control" style="max-width:140px;">
        <option value="">${t('app.all')}</option>
        <option value="cash">${t('sales.types.cash')}</option>
        <option value="credit">${t('sales.types.credit')}</option>
        <option value="wholesale">${t('sales.types.wholesale')}</option>
      </select>
      <button class="btn btn-secondary" id="sales-filter-btn">🔍 ${t('app.filter')}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('sales.invoice')}</th>
          <th>${t('sales.date')}</th>
          <th>${t('sales.customer')}</th>
          <th>${t('sales.type')}</th>
          <th class="text-right">${t('sales.total')}</th>
          <th class="text-right">${t('sales.paid')}</th>
          <th class="text-right">${t('sales.due')}</th>
          <th>${t('sales.status')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="sales-tbody"><tr><td colspan="9"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="sales-pagination"></div>
    </div>
  `;

  filters.start_date = today;
  filters.end_date = today;

  await loadSales();
  document.getElementById('sales-filter-btn')?.addEventListener('click', () => {
    filters.start_date = document.getElementById('sale-from')?.value;
    filters.end_date = document.getElementById('sale-to')?.value;
    filters.sale_type = document.getElementById('sale-type-filter')?.value;
    page = 1; loadSales();
  });
}

async function loadSales() {
  const tbody = document.getElementById('sales-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="9"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;
  try {
    const params = { page, limit: 50, ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const data = await salesApi.list(params);
    const sales = data.sales;

    if (!sales.length) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t('sales.noSales')}</div></div></td></tr>`;
      return;
    }

    if (tbody) tbody.innerHTML = sales.map((s) => `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; font-weight:600;">${s.invoice_no}</td>
        <td>${formatDate(s.sale_date)}</td>
        <td>${s.customer_name || '—'}</td>
        <td><span class="badge ${s.sale_type === 'cash' ? 'badge-success' : s.sale_type === 'credit' ? 'badge-warning' : 'badge-info'}">${t(`sales.types.${s.sale_type}`)}</span></td>
        <td class="text-right amount">${formatTaka(s.total)}</td>
        <td class="text-right amount positive">${formatTaka(s.paid)}</td>
        <td class="text-right amount ${parseFloat(s.due) > 0 ? 'negative' : ''}">${formatTaka(s.due)}</td>
        <td><span class="badge ${s.status === 'completed' ? 'badge-success' : 'badge-danger'}">${t(`sales.${s.status}`)}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary view-btn" data-id="${s.id}">👁</button>
            ${s.status === 'completed' ? `<button class="btn btn-sm btn-danger void-btn" data-id="${s.id}">✕ ${t('sales.void')}</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    tbody?.querySelectorAll('.view-btn').forEach((b) => b.addEventListener('click', () => openSaleDetail(b.dataset.id)));
    tbody?.querySelectorAll('.void-btn').forEach((b) => b.addEventListener('click', () => voidSale(b.dataset.id)));
    renderPagination(data.total, page, 50, 'sales-pagination', (p) => { page = p; loadSales(); });
  } catch (err) { handleApiError(err); }
}

async function openSaleDetail(id) {
  const bodyEl = document.createElement('div');
  bodyEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  showModal({ title: t('sales.viewInvoice'), body: bodyEl, size: 'lg',
    footer: [{ label: t('app.close'), class: 'btn-secondary', action: ({ close }) => close() }] });
  try {
    const { sale, items } = await salesApi.get(id);
    bodyEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <div style="font-size:1.2rem; font-weight:700; font-family:monospace;">${sale.invoice_no}</div>
          <div style="color:var(--text-muted); font-size:0.8rem;">${formatDate(sale.sale_date)}</div>
        </div>
        <span class="badge ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}">${t(`sales.${sale.status}`)}</span>
      </div>
      ${sale.customer_name ? `<div style="margin-bottom:1rem; padding:0.75rem; background:var(--bg-base); border-radius:0.5rem;">
        <div style="font-size:0.75rem; color:var(--text-muted);">${t('sales.customer')}</div>
        <div style="font-weight:600;">${sale.customer_name}</div>
        ${sale.customer_phone ? `<div style="font-size:0.8rem; color:var(--text-secondary);">${sale.customer_phone}</div>` : ''}
      </div>` : ''}
      <table class="table" style="margin-bottom:1rem;">
        <thead><tr><th>${t('pos.product')}</th><th class="text-right">${t('pos.qty')}</th><th class="text-right">${t('pos.unitPrice')}</th><th class="text-right">${t('pos.itemTotal')}</th></tr></thead>
        <tbody>
          ${items.map((i) => `<tr><td>${i.product_name}</td><td class="text-right">${i.qty} ${i.unit}</td><td class="text-right amount">${formatTaka(i.unit_price)}</td><td class="text-right amount">${formatTaka(i.total)}</td></tr>`).join('')}
        </tbody>
        <tfoot>
          <tr><td colspan="3" class="text-right" style="font-weight:600;">${t('app.subtotal')}</td><td class="text-right amount">${formatTaka(sale.subtotal)}</td></tr>
          ${parseFloat(sale.discount) > 0 ? `<tr><td colspan="3" class="text-right" style="color:var(--text-muted);">${t('app.discount')}</td><td class="text-right amount" style="color:var(--color-danger);">−${formatTaka(sale.discount)}</td></tr>` : ''}
          <tr><td colspan="3" class="text-right" style="font-weight:700; font-size:1rem;">${t('app.total')}</td><td class="text-right amount" style="font-size:1rem; font-weight:700;">${formatTaka(sale.total)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-success);">${t('app.paid')}</td><td class="text-right amount" style="color:var(--color-success);">${formatTaka(sale.paid)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-warning);">${t('app.due')}</td><td class="text-right amount" style="color:var(--color-warning);">${formatTaka(sale.due)}</td></tr>
        </tfoot>
      </table>
      ${sale.void_reason ? `<div style="background:var(--color-danger-light); border:1px solid var(--color-danger); border-radius:0.5rem; padding:0.75rem; color:#991b1b; font-size:0.875rem;"><strong>${t('sales.voidReason')}:</strong> ${sale.void_reason}</div>` : ''}
    `;
  } catch (err) { bodyEl.innerHTML = `<p>${err.message}</p>`; }
}

async function voidSale(id) {
  const ok = await confirmDialog({ message: t('sales.voidConfirm'), type: 'danger', confirmLabel: t('sales.void') });
  if (!ok) return;

  // Get void reason
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group">
      <label class="form-label">${t('sales.voidReason')} *</label>
      <textarea name="void_reason" class="form-control" rows="3" placeholder="${t('sales.voidReason')}" required></textarea>
    </div>
  `;
  showModal({
    title: t('sales.void'), body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('sales.void'), class: 'btn-danger', action: async ({ close }) => {
        const reason = formEl.querySelector('[name=void_reason]').value;
        if (!reason) { showError(t('sales.voidReason') + ' required'); return; }
        try { await salesApi.void(id, reason); showSuccess('Sale voided'); close(); loadSales(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}
