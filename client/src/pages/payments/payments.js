/**
 * Payments Page — Customer & Supplier Payments
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { paymentsApi, customersApi, suppliersApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';
import { navigate } from '../../core/router.js';

let activeType = 'customers'; // 'customers' | 'suppliers'
let page = 1;
let filters = { start_date: '', end_date: '', entity_id: '' };

export async function renderPayments(outlet, params = {}) {
  const currentHash = window.location.hash;
  const isSupplier = currentHash.includes('/suppliers');
  const isNew = currentHash.includes('/new');

  activeType = isSupplier ? 'suppliers' : 'customers';
  page = 1;
  filters = { start_date: '', end_date: '', entity_id: '' };

  const title = activeType === 'customers' ? t('payments.customerTitle') : t('payments.supplierTitle');
  setTopbarTitle(title);

  const today = new Date().toISOString().slice(0, 10);

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title" id="payments-page-title">${title}</h1>
      <button class="btn btn-primary" id="add-payment-btn">
        + ${activeType === 'customers' ? t('payments.receivePayment') : t('payments.makePayment')}
      </button>
    </div>

    <!-- Tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border);">
      <button class="btn ${activeType === 'customers' ? 'btn-primary' : 'btn-ghost'} pay-tab" data-type="customers">
        💰 ${t('payments.customerTitle')}
      </button>
      <button class="btn ${activeType === 'suppliers' ? 'btn-primary' : 'btn-ghost'} pay-tab" data-type="suppliers">
        💸 ${t('payments.supplierTitle')}
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <input type="date" id="pay-from" class="form-control" style="max-width:160px;" placeholder="From Date" />
      <input type="date" id="pay-to" class="form-control" style="max-width:160px;" placeholder="To Date" />
      <select id="pay-entity-filter" class="form-control" style="max-width:220px;">
        <option value="">${activeType === 'customers' ? t('payments.customer') : t('payments.supplier')} (${t('app.all')})</option>
      </select>
      <button class="btn btn-secondary btn-sm" id="pay-filter-reset">${t('app.reset')}</button>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>${t('payments.paymentDate')}</th>
            <th>${t('sales.invoiceNo')}</th>
            <th>${activeType === 'customers' ? t('payments.customer') : t('payments.supplier')}</th>
            <th>${t('payments.account')}</th>
            <th>${t('payments.method')}</th>
            <th>${t('payments.reference')}</th>
            <th class="text-right">${t('payments.amount')}</th>
            <th>${t('app.actions')}</th>
          </tr>
        </thead>
        <tbody id="payments-tbody">
          <tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="payments-pagination"></div>
    </div>
  `;

  await loadEntities();
  await loadPayments();
  bindEvents();

  if (isNew) {
    openPaymentModal();
  }
}

async function loadEntities() {
  const sel = document.getElementById('pay-entity-filter');
  if (!sel) return;

  try {
    if (activeType === 'customers') {
      const data = await customersApi.list({ limit: 500 });
      const customers = data.customers || [];
      sel.innerHTML = `<option value="">${t('payments.customer')} (${t('app.all')})</option>` +
        customers.map(c => `<option value="${c.id}">${c.name} (${c.phone || '—'})</option>`).join('');
    } else {
      const data = await suppliersApi.list({ limit: 500 });
      const suppliers = data.suppliers || [];
      sel.innerHTML = `<option value="">${t('payments.supplier')} (${t('app.all')})</option>` +
        suppliers.map(s => `<option value="${s.id}">${s.name} (${s.phone || '—'})</option>`).join('');
    }
  } catch {}
}

async function loadPayments() {
  const tbody = document.getElementById('payments-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;

  try {
    const queryParams = { page, limit: 20 };
    if (filters.start_date) queryParams.start_date = filters.start_date;
    if (filters.end_date) queryParams.end_date = filters.end_date;
    if (filters.entity_id) {
      if (activeType === 'customers') queryParams.customer_id = filters.entity_id;
      else queryParams.supplier_id = filters.entity_id;
    }

    const res = activeType === 'customers'
      ? await paymentsApi.customerList(queryParams)
      : await paymentsApi.supplierList(queryParams);

    const payments = res.payments || [];
    const total = res.total || 0;

    if (!tbody) return;
    if (!payments.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">💳</div>
              <div class="empty-state-title">${t('app.noData')}</div>
            </div>
          </td>
        </tr>
      `;
      renderPagination(0, 1, 20, 'payments-pagination', () => {});
      return;
    }

    tbody.innerHTML = payments.map((p) => `
      <tr>
        <td>${formatDate(p.payment_date)}</td>
        <td style="font-family:monospace; font-weight:600; color:var(--primary);">${p.payment_no}</td>
        <td style="font-weight:500;">${p.customer_name || p.supplier_name || '—'}</td>
        <td>${p.account_name || '—'}</td>
        <td><span class="badge badge-outline">${t(`payments.methods.${p.method}`) || p.method}</span></td>
        <td style="font-size:0.85rem; color:var(--text-muted);">${p.reference || '—'}</td>
        <td class="text-right amount font-bold" style="color:${activeType === 'customers' ? 'var(--success)' : 'var(--danger)'};">
          ${activeType === 'customers' ? '+' : '-'}${formatTaka(p.amount)}
        </td>
        <td>
          <button class="btn btn-sm btn-ghost view-payment-btn" data-id="${p.id}" title="${t('app.view')}">👁</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.view-payment-btn').forEach((b) => {
      b.addEventListener('click', () => {
        const item = payments.find((x) => x.id === parseInt(b.dataset.id));
        if (item) viewPaymentDetails(item);
      });
    });

    renderPagination(total, page, 20, 'payments-pagination', (newPage) => {
      page = newPage;
      loadPayments();
    });
  } catch (err) {
    handleApiError(err);
  }
}

function bindEvents() {
  document.querySelectorAll('.pay-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.type;
      navigate(type === 'customers' ? '/payments/customers' : '/payments/suppliers');
    });
  });

  document.getElementById('add-payment-btn')?.addEventListener('click', () => openPaymentModal());

  document.getElementById('pay-from')?.addEventListener('change', (e) => {
    filters.start_date = e.target.value;
    page = 1;
    loadPayments();
  });

  document.getElementById('pay-to')?.addEventListener('change', (e) => {
    filters.end_date = e.target.value;
    page = 1;
    loadPayments();
  });

  document.getElementById('pay-entity-filter')?.addEventListener('change', (e) => {
    filters.entity_id = e.target.value;
    page = 1;
    loadPayments();
  });

  document.getElementById('pay-filter-reset')?.addEventListener('click', () => {
    document.getElementById('pay-from').value = '';
    document.getElementById('pay-to').value = '';
    document.getElementById('pay-entity-filter').value = '';
    filters = { start_date: '', end_date: '', entity_id: '' };
    page = 1;
    loadPayments();
  });
}

async function openPaymentModal() {
  const isCust = activeType === 'customers';
  const today = new Date().toISOString().slice(0, 10);

  let entities = [];
  let accounts = [];

  try {
    const [entitiesRes, accountsRes] = await Promise.all([
      isCust ? customersApi.list({ limit: 500 }) : suppliersApi.list({ limit: 500 }),
      accountsApi.list(),
    ]);
    entities = isCust ? (entitiesRes.customers || []) : (entitiesRes.suppliers || []);
    accounts = accountsRes.accounts || [];
  } catch (err) {
    handleApiError(err);
    return;
  }

  const title = isCust ? t('payments.receivePayment') : t('payments.makePayment');

  const content = `
    <form id="payment-modal-form">
      <div class="form-group">
        <label class="form-label">${isCust ? t('payments.customer') : t('payments.supplier')} <span class="required-star">*</span></label>
        <select name="${isCust ? 'customer_id' : 'supplier_id'}" class="form-control" id="modal-pay-entity" required>
          <option value="">-- ${t('app.select')} --</option>
          ${entities.map(e => `
            <option value="${e.id}" data-balance="${e.balance}">
              ${e.name} (${t('customers.currentDue')}: ${formatTaka(e.balance)})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="form-row cols-2">
        <div class="form-group">
          <label class="form-label">${t('payments.amount')} <span class="required-star">*</span></label>
          <input name="amount" id="modal-pay-amount" type="number" min="0.01" step="0.01" class="form-control" required placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('payments.account')} <span class="required-star">*</span></label>
          <select name="account_id" class="form-control" required>
            ${accounts.map(a => `<option value="${a.id}">${a.name} (${t(`accounts.types.${a.type}`) || a.type})</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-row cols-2">
        <div class="form-group">
          <label class="form-label">${t('payments.method')}</label>
          <select name="method" class="form-control">
            ${['cash', 'bank_transfer', 'cheque', 'mobile_banking'].map(m => `
              <option value="${m}">${t(`payments.methods.${m}`)}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t('payments.paymentDate')}</label>
          <input name="payment_date" type="date" class="form-control" value="${today}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${t('payments.reference')}</label>
        <input name="reference" class="form-control" placeholder="Cheque # / Trx ID / Receipt #" />
      </div>

      <div class="form-group">
        <label class="form-label">${t('app.notes')}</label>
        <textarea name="notes" class="form-control" rows="2" placeholder="Optional notes..."></textarea>
      </div>
    </form>
  `;

  showModal({
    title,
    content,
    buttons: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      {
        label: title,
        class: 'btn-success',
        action: async ({ close }) => {
          const form = document.getElementById('payment-modal-form');
          if (!form) return;
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);

          if (!data.amount || parseFloat(data.amount) <= 0) {
            showError('Please enter a valid payment amount');
            return;
          }

          if (isCust && !data.customer_id) {
            showError('Please select a customer');
            return;
          }
          if (!isCust && !data.supplier_id) {
            showError('Please select a supplier');
            return;
          }
          if (!data.account_id) {
            showError('Please select an account');
            return;
          }

          try {
            if (isCust) {
              await paymentsApi.customerCreate(data);
            } else {
              await paymentsApi.supplierCreate(data);
            }
            showSuccess(t('payments.recorded'));
            close();
            loadPayments();
          } catch (err) {
            showError(err.message || 'Payment recording failed');
          }
        },
      },
    ],
  });

  // Auto-fill amount with entity's due balance when selected
  document.getElementById('modal-pay-entity')?.addEventListener('change', (e) => {
    const opt = e.target.selectedOptions[0];
    const bal = opt ? parseFloat(opt.dataset.balance || '0') : 0;
    const amtInput = document.getElementById('modal-pay-amount');
    if (bal > 0 && amtInput && !amtInput.value) {
      amtInput.value = bal.toFixed(2);
    }
  });
}

function viewPaymentDetails(payment) {
  const isCust = activeType === 'customers';
  const content = `
    <div id="payment-receipt-print" style="padding:1rem; font-family:var(--font-sans);">
      <div style="text-align:center; border-bottom:1px dashed var(--border); padding-bottom:1rem; margin-bottom:1rem;">
        <h3 style="margin:0; font-size:1.25rem;">${t('app.name')}</h3>
        <p style="margin:0.25rem 0; font-size:0.85rem; color:var(--text-muted);">${t('app.company')}</p>
        <h4 style="margin:0.5rem 0 0; color:var(--primary); font-size:1rem;">
          ${isCust ? t('payments.customerTitle') : t('payments.supplierTitle')} ${t('reports.statement')}
        </h4>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.9rem; margin-bottom:1rem;">
        <div><strong>${t('sales.invoiceNo')}:</strong> ${payment.payment_no}</div>
        <div><strong>${t('payments.paymentDate')}:</strong> ${formatDate(payment.payment_date)}</div>
        <div><strong>${isCust ? t('payments.customer') : t('payments.supplier')}:</strong> ${payment.customer_name || payment.supplier_name}</div>
        <div><strong>${t('payments.account')}:</strong> ${payment.account_name}</div>
        <div><strong>${t('payments.method')}:</strong> ${t(`payments.methods.${payment.method}`) || payment.method}</div>
        <div><strong>${t('payments.reference')}:</strong> ${payment.reference || '—'}</div>
      </div>

      <div style="background:var(--bg-card-hover); padding:1rem; border-radius:var(--radius-md); text-align:center; margin-bottom:1rem;">
        <div style="font-size:0.85rem; color:var(--text-muted);">${t('payments.amount')}</div>
        <div style="font-size:1.75rem; font-weight:700; color:var(--success);">${formatTaka(payment.amount)}</div>
      </div>

      ${payment.notes ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin:0;"><strong>${t('app.notes')}:</strong> ${payment.notes}</p>` : ''}
    </div>
  `;

  showModal({
    title: `${t('payments.recorded')}: ${payment.payment_no}`,
    content,
    buttons: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      {
        label: `🖨 ${t('pos.printReceipt')}`,
        class: 'btn-primary',
        action: () => {
          const printArea = document.getElementById('payment-receipt-print');
          if (!printArea) return;
          const win = window.open('', '_blank');
          win.document.write(`
            <html>
              <head><title>Receipt - ${payment.payment_no}</title></head>
              <body style="font-family:sans-serif; padding:20px;">
                ${printArea.innerHTML}
                <script>window.onload = function() { window.print(); window.close(); }<\/script>
              </body>
            </html>
          `);
          win.document.close();
        },
      },
    ],
  });
}
