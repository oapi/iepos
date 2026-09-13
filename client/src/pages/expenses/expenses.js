/**
 * Expenses Page
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { expensesApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

let page = 1;
let filters = { start_date: '', end_date: '' };

export async function renderExpenses(outlet) {
  setTopbarTitle(t('expenses.title'));
  const today = new Date().toISOString().slice(0, 10);

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('expenses.title')}</h1>
      <button class="btn btn-primary" id="add-expense-btn">+ ${t('expenses.add')}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="exp-from" class="form-control" style="max-width:160px;" value="${today}" />
      <input type="date" id="exp-to" class="form-control" style="max-width:160px;" value="${today}" />
      <button class="btn btn-secondary" id="exp-filter-btn">🔍 ${t('app.filter')}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('expenses.date')}</th>
          <th>${t('expenses.category')}</th>
          <th>${t('expenses.description')}</th>
          <th>${t('expenses.account')}</th>
          <th class="text-right">${t('expenses.amount')}</th>
        </tr></thead>
        <tbody id="expenses-tbody"><tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="expenses-pagination"></div>
    </div>
  `;

  filters.start_date = today;
  filters.end_date = today;
  await loadExpenses();

  document.getElementById('exp-filter-btn')?.addEventListener('click', () => {
    filters.start_date = document.getElementById('exp-from')?.value;
    filters.end_date = document.getElementById('exp-to')?.value;
    page = 1; loadExpenses();
  });
  document.getElementById('add-expense-btn')?.addEventListener('click', () => openExpenseModal());
}

async function loadExpenses() {
  const tbody = document.getElementById('expenses-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;
  try {
    const params = { page, limit: 50, ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const data = await expensesApi.list(params);
    const expenses = data.expenses;
    if (!expenses.length) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">💳</div><div class="empty-state-title">${t('expenses.noExpenses')}</div></div></td></tr>`;
      return;
    }
    if (tbody) tbody.innerHTML = expenses.map((e) => `
      <tr>
        <td>${formatDate(e.expense_date)}</td>
        <td>${e.category_name || '—'}</td>
        <td>${e.description || '—'}</td>
        <td>${e.account_name || '—'}</td>
        <td class="text-right amount negative">${formatTaka(e.amount)}</td>
      </tr>
    `).join('');
    renderPagination(data.total, page, 50, 'expenses-pagination', (p) => { page = p; loadExpenses(); });
  } catch (err) { handleApiError(err); }
}

async function openExpenseModal() {
  let categories = [], accounts = [];
  try {
    const [cd, ad] = await Promise.all([expensesApi.categories(), accountsApi.list()]);
    categories = cd.categories;
    accounts = ad.accounts.filter((a) => a.type !== 'capital');
  } catch {}

  const today = new Date().toISOString().slice(0, 10);
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('expenses.category')} *</label>
        <select name="category_id" class="form-control" required>
          <option value="">${t('app.selectOption')}</option>
          ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t('expenses.amount')} *</label>
        <input name="amount" type="number" min="0.01" step="0.01" class="form-control" required />
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('expenses.account')} *</label>
        <select name="account_id" class="form-control" required>
          <option value="">${t('app.selectOption')}</option>
          ${accounts.map((a) => `<option value="${a.id}" ${a.is_default ? 'selected' : ''}>${a.name} (${formatTaka(a.balance)})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t('expenses.date')} *</label>
        <input name="expense_date" type="date" class="form-control" value="${today}" required />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t('expenses.description')}</label>
      <textarea name="description" class="form-control" rows="3"></textarea>
    </div>
  `;

  showModal({
    title: t('expenses.add'), body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (!data.category_id || !data.amount || !data.account_id) { showError('All required fields must be filled'); return; }
        try { await expensesApi.create(data); showSuccess(t('expenses.saved')); close(); loadExpenses(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}
