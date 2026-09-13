/**
 * Suppliers Page — mirrors Customers
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { suppliersApi, paymentsApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

let page = 1, search = '';

export async function renderSuppliers(outlet) {
  setTopbarTitle(t('suppliers.title'));
  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('suppliers.title')}</h1>
      <button class="btn btn-primary" id="add-supplier-btn">+ ${t('suppliers.add')}</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="supplier-search" class="form-control" placeholder="${t('app.search')}" />
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('suppliers.name')}</th>
          <th>${t('suppliers.phone')}</th>
          <th class="text-right">${t('suppliers.currentDue')}</th>
          <th>${t('suppliers.lastTransaction')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="suppliers-tbody"><tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="suppliers-pagination"></div>
    </div>
  `;
  await loadSuppliers();
  document.getElementById('add-supplier-btn')?.addEventListener('click', () => openModal(null));
  let t2;
  document.getElementById('supplier-search')?.addEventListener('input', (e) => {
    clearTimeout(t2);
    t2 = setTimeout(() => { search = e.target.value; page = 1; loadSuppliers(); }, 400);
  });
}

async function loadSuppliers() {
  const tbody = document.getElementById('suppliers-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;
  try {
    const data = await suppliersApi.list({ page, limit: 50, search });
    const suppliers = data.suppliers;
    if (!suppliers.length) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">🏭</div><div class="empty-state-title">${t('suppliers.noSuppliers')}</div></div></td></tr>`;
      return;
    }
    if (tbody) tbody.innerHTML = suppliers.map((s) => `
      <tr>
        <td><div style="font-weight:500;">${s.name}</div></td>
        <td>${s.phone || '—'}</td>
        <td class="text-right"><span class="${parseFloat(s.balance) > 0 ? 'text-warning font-semibold' : 'text-muted'}">${formatTaka(s.balance)}</span></td>
        <td style="font-size:0.8rem; color:var(--text-muted);">—</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary ledger-btn" data-id="${s.id}" data-name="${s.name}">📋</button>
            <button class="btn btn-sm btn-success pay-btn" data-id="${s.id}" data-name="${s.name}" data-balance="${s.balance}">💸</button>
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${s.id}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${s.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');
    tbody?.querySelectorAll('.edit-btn').forEach((b) => b.addEventListener('click', () => openModal(b.dataset.id)));
    tbody?.querySelectorAll('.del-btn').forEach((b) => b.addEventListener('click', () => del(b.dataset.id)));
    tbody?.querySelectorAll('.ledger-btn').forEach((b) => b.addEventListener('click', () => openLedger(b.dataset.id, b.dataset.name)));
    tbody?.querySelectorAll('.pay-btn').forEach((b) => b.addEventListener('click', () => openPayment(b.dataset.id, b.dataset.name, b.dataset.balance)));
    renderPagination(data.total, page, 50, 'suppliers-pagination', (p) => { page = p; loadSuppliers(); });
  } catch (err) { handleApiError(err); }
}

async function openModal(id) {
  let s = {};
  if (id) { try { s = (await suppliersApi.get(id)).supplier; } catch (err) { handleApiError(err); return; } }
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t('suppliers.name')} *</label><input name="name" class="form-control" value="${s.name || ''}" required /></div>
      <div class="form-group"><label class="form-label">${t('suppliers.phone')}</label><input name="phone" class="form-control" value="${s.phone || ''}" /></div>
    </div>
    <div class="form-group"><label class="form-label">${t('suppliers.address')}</label><textarea name="address" class="form-control" rows="2">${s.address || ''}</textarea></div>
    <div class="form-group"><label class="form-label">${t('app.notes')}</label><textarea name="notes" class="form-control" rows="2">${s.notes || ''}</textarea></div>
    ${id ? `<div class="form-check"><input type="checkbox" name="is_active" ${s.is_active ? 'checked' : ''} /><label class="form-label" style="margin:0;">${t('app.active')}</label></div>` : ''}
  `;
  showModal({
    title: id ? t('suppliers.edit') : t('suppliers.add'),
    body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (id) data.is_active = formEl.querySelector('[name=is_active]')?.checked ?? true;
        try { id ? await suppliersApi.update(id, data) : await suppliersApi.create(data); showSuccess(t('suppliers.saved')); close(); loadSuppliers(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

async function del(id) {
  const ok = await confirmDialog({ message: t('suppliers.deleteConfirm'), type: 'danger' });
  if (!ok) return;
  try { await suppliersApi.delete(id); loadSuppliers(); } catch (err) { handleApiError(err); }
}

async function openLedger(id, name) {
  const bodyEl = document.createElement('div');
  bodyEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  showModal({ title: `${t('ledger.title')} — ${name}`, body: bodyEl, size: 'xl',
    footer: [{ label: t('app.close'), class: 'btn-secondary', action: ({ close }) => close() }] });
  try {
    const { ledger } = await suppliersApi.ledger(id);
    if (!ledger.length) { bodyEl.innerHTML = `<div class="empty-state"><div class="empty-state-title">${t('ledger.noEntries')}</div></div>`; return; }
    bodyEl.innerHTML = `<div class="table-wrapper"><table class="table"><thead><tr><th>${t('ledger.date')}</th><th>${t('ledger.description')}</th><th class="text-right">${t('ledger.debit')}</th><th class="text-right">${t('ledger.credit')}</th><th class="text-right">${t('ledger.balance')}</th></tr></thead><tbody>
      ${ledger.map((r) => `<tr><td>${formatDate(r.txn_date)}</td><td><div style="font-weight:500;">${r.type}</div><div style="font-size:0.75rem; color:var(--text-muted);">${r.reference}</div></td><td class="text-right amount">${parseFloat(r.debit) > 0 ? formatTaka(r.debit) : '—'}</td><td class="text-right amount">${parseFloat(r.credit) > 0 ? formatTaka(r.credit) : '—'}</td><td class="text-right amount">${formatTaka(r.balance)}</td></tr>`).join('')}
    </tbody></table></div>`;
  } catch (err) { bodyEl.innerHTML = `<div class="empty-state"><div class="empty-state-title">${err.message}</div></div>`; }
}

async function openPayment(supplierId, supplierName, balance) {
  let accounts = [];
  try { const d = await accountsApi.list(); accounts = d.accounts.filter((a) => a.type !== 'capital'); } catch {}
  const today = new Date().toISOString().slice(0, 10);
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e;">
      ${t('suppliers.currentDue')}: <strong>${formatTaka(balance)}</strong>
    </div>
    <div class="form-group"><label class="form-label">${t('payments.amount')} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" value="${parseFloat(balance) > 0 ? parseFloat(balance).toFixed(2) : ''}" required /></div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t('payments.account')} *</label>
        <select name="account_id" class="form-control" required><option value="">${t('app.selectOption')}</option>${accounts.map((a) => `<option value="${a.id}" ${a.is_default ? 'selected' : ''}>${a.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">${t('payments.method')}</label>
        <select name="method" class="form-control">${['cash','bank_transfer','cheque','mobile_banking'].map((m) => `<option value="${m}">${t(`payments.methods.${m}`)}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t('payments.paymentDate')}</label><input name="payment_date" type="date" class="form-control" value="${today}" /></div>
      <div class="form-group"><label class="form-label">${t('payments.reference')}</label><input name="reference" class="form-control" /></div>
    </div>
  `;
  showModal({
    title: `${t('suppliers.makePayment')} — ${supplierName}`, body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('payments.makePayment'), class: 'btn-success', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        data.supplier_id = supplierId;
        try { await paymentsApi.supplierCreate(data); showSuccess(t('payments.recorded')); close(); loadSuppliers(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}
