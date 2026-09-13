/**
 * Customers Page — List, CRUD, Ledger, Payments
 */
import { t, formatTaka, formatDate, formatDateTime } from '../../core/i18n.js';
import { customersApi, paymentsApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

let page = 1, search = '';

export async function renderCustomers(outlet) {
  setTopbarTitle(t('customers.title'));

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('customers.title')}</h1>
      <button class="btn btn-primary" id="add-customer-btn">+ ${t('customers.add')}</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="customer-search" class="form-control" placeholder="${t('customers.searchPlaceholder')}" />
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('customers.name')}</th>
          <th>${t('customers.phone')}</th>
          <th class="text-right">${t('customers.currentDue')}</th>
          <th>${t('customers.lastTransaction')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="customers-tbody">
          <tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="customers-pagination"></div>
    </div>
  `;

  await loadCustomers();
  bindEvents();
}

async function loadCustomers() {
  const tbody = document.getElementById('customers-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;
  try {
    const data = await customersApi.list({ page, limit: 50, search });
    const customers = data.customers;

    if (!tbody) return;
    if (!customers.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-title">${t('customers.noCustomers')}</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = customers.map((c) => `
      <tr>
        <td>
          <div style="font-weight:500;">${c.name}</div>
          ${c.address ? `<div style="font-size:0.75rem; color:var(--text-muted);">${c.address}</div>` : ''}
        </td>
        <td>${c.phone || '—'}</td>
        <td class="text-right">
          <span class="${parseFloat(c.balance) > 0 ? 'text-warning font-semibold' : 'text-muted'}">${formatTaka(c.balance)}</span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${c.last_transaction ? formatDate(c.last_transaction) : '—'}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary ledger-btn" data-id="${c.id}" data-name="${c.name}" title="${t('customers.ledger')}">📋</button>
            <button class="btn btn-sm btn-success pay-btn" data-id="${c.id}" data-name="${c.name}" data-balance="${c.balance}" title="${t('customers.receivePayment')}">💰</button>
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${c.id}" title="${t('app.edit')}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${c.id}" title="${t('app.delete')}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.edit-btn').forEach((b) => b.addEventListener('click', () => openCustomerModal(b.dataset.id)));
    tbody.querySelectorAll('.del-btn').forEach((b) => b.addEventListener('click', () => deleteCustomer(b.dataset.id)));
    tbody.querySelectorAll('.ledger-btn').forEach((b) => b.addEventListener('click', () => openLedger(b.dataset.id, b.dataset.name)));
    tbody.querySelectorAll('.pay-btn').forEach((b) => b.addEventListener('click', () => openPaymentModal(b.dataset.id, b.dataset.name, b.dataset.balance)));

    renderPagination(data.total, page, 50, 'customers-pagination', (p) => { page = p; loadCustomers(); });
  } catch (err) { handleApiError(err); }
}

function bindEvents() {
  document.getElementById('add-customer-btn')?.addEventListener('click', () => openCustomerModal(null));
  let t2;
  document.getElementById('customer-search')?.addEventListener('input', (e) => {
    clearTimeout(t2);
    t2 = setTimeout(() => { search = e.target.value; page = 1; loadCustomers(); }, 400);
  });
}

async function openCustomerModal(id) {
  let customer = {};
  if (id) { try { const d = await customersApi.get(id); customer = d.customer; } catch (err) { handleApiError(err); return; } }

  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('customers.name')} <span class="required-star">*</span></label>
        <input name="name" class="form-control" value="${customer.name || ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label">${t('customers.phone')}</label>
        <input name="phone" class="form-control" value="${customer.phone || ''}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t('customers.address')}</label>
      <textarea name="address" class="form-control" rows="2">${customer.address || ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">${t('customers.creditLimit')}</label>
      <input name="credit_limit" type="number" min="0" step="0.01" class="form-control" value="${customer.credit_limit || 0}" />
    </div>
    ${id ? `<div class="form-check"><input type="checkbox" name="is_active" ${customer.is_active ? 'checked' : ''} /><label class="form-label" style="margin:0;">${t('app.active')}</label></div>` : ''}
  `;

  showModal({
    title: id ? t('customers.edit') : t('customers.add'),
    body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (!data.name) { showError(t('customers.name') + ' required'); return; }
        if (id) data.is_active = formEl.querySelector('[name=is_active]')?.checked ?? true;
        try {
          id ? await customersApi.update(id, data) : await customersApi.create(data);
          showSuccess(t('customers.saved')); close(); loadCustomers();
        } catch (err) { showError(err.message); }
      }},
    ],
  });
}

async function deleteCustomer(id) {
  const ok = await confirmDialog({ message: t('customers.deleteConfirm'), type: 'danger' });
  if (!ok) return;
  try { await customersApi.delete(id); showSuccess(t('customers.saved')); loadCustomers(); }
  catch (err) { handleApiError(err); }
}

async function openLedger(customerId, customerName) {
  const bodyEl = document.createElement('div');
  bodyEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  const { close } = showModal({
    title: `${t('ledger.title')} — ${customerName}`,
    body: bodyEl, size: 'xl',
    footer: [{ label: t('app.close'), class: 'btn-secondary', action: ({ close }) => close() }],
  });

  try {
    const { ledger } = await customersApi.ledger(customerId);
    if (!ledger.length) {
      bodyEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t('ledger.noEntries')}</div></div>`;
      return;
    }
    bodyEl.innerHTML = `
      <div class="table-wrapper">
        <table class="table">
          <thead><tr>
            <th>${t('ledger.date')}</th>
            <th>${t('ledger.description')}</th>
            <th class="text-right">${t('ledger.debit')}</th>
            <th class="text-right">${t('ledger.credit')}</th>
            <th class="text-right">${t('ledger.balance')}</th>
          </tr></thead>
          <tbody>
            ${ledger.map((row) => `
              <tr>
                <td>${formatDate(row.txn_date)}</td>
                <td>
                  <div style="font-weight:500;">${row.type}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${row.reference}</div>
                </td>
                <td class="text-right amount ${parseFloat(row.debit) > 0 ? 'positive' : ''}">${parseFloat(row.debit) > 0 ? formatTaka(row.debit) : '—'}</td>
                <td class="text-right amount ${parseFloat(row.credit) > 0 ? 'positive' : ''}">${parseFloat(row.credit) > 0 ? formatTaka(row.credit) : '—'}</td>
                <td class="text-right amount ${row.balance > 0 ? '' : 'positive'}">${formatTaka(row.balance)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) { bodyEl.innerHTML = `<div class="empty-state"><div class="empty-state-title">${err.message}</div></div>`; }
}

async function openPaymentModal(customerId, customerName, balance) {
  let accounts = [];
  try { const d = await accountsApi.list(); accounts = d.accounts.filter((a) => a.type !== 'capital'); } catch {}

  const formEl = document.createElement('form');
  const today = new Date().toISOString().slice(0, 10);
  formEl.innerHTML = `
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e;">
      ${t('customers.currentDue')}: <strong>${formatTaka(balance)}</strong>
    </div>
    <div class="form-group">
      <label class="form-label">${t('payments.amount')} <span class="required-star">*</span></label>
      <input name="amount" type="number" min="0.01" step="0.01" class="form-control" value="${balance > 0 ? parseFloat(balance).toFixed(2) : ''}" required />
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('payments.account')} <span class="required-star">*</span></label>
        <select name="account_id" class="form-control" required>
          <option value="">${t('app.selectOption')}</option>
          ${accounts.map((a) => `<option value="${a.id}" ${a.is_default ? 'selected' : ''}>${a.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t('payments.method')}</label>
        <select name="method" class="form-control">
          ${['cash','bank_transfer','cheque','mobile_banking'].map((m) => `<option value="${m}">${t(`payments.methods.${m}`)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('payments.paymentDate')}</label>
        <input name="payment_date" type="date" class="form-control" value="${today}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('payments.reference')}</label>
        <input name="reference" class="form-control" placeholder="${t('app.optional')}" />
      </div>
    </div>
  `;

  showModal({
    title: `${t('customers.receivePayment')} — ${customerName}`,
    body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('payments.receivePayment'), class: 'btn-success', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        data.customer_id = customerId;
        if (!data.amount || !data.account_id) { showError(t('payments.amount') + ' and ' + t('payments.account') + ' required'); return; }
        try {
          await paymentsApi.customerCreate(data);
          showSuccess(t('payments.recorded')); close(); loadCustomers();
        } catch (err) { showError(err.message); }
      }},
    ],
  });
}
