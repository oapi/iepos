/**
 * Accounts Page — List, Statement, Deposit/Withdraw/Transfer
 */
import { t, formatTaka, formatDateTime } from '../../core/i18n.js';
import { accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

export async function renderAccounts(outlet) {
  setTopbarTitle(t('accounts.title'));
  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('accounts.title')}</h1>
      <button class="btn btn-primary" id="add-account-btn">+ ${t('accounts.add')}</button>
    </div>
    <div id="accounts-content"><div class="loading-spinner"><div class="spinner"></div></div></div>
  `;
  await loadAccounts();
  document.getElementById('add-account-btn')?.addEventListener('click', () => openAccountModal(null));
}

async function loadAccounts() {
  const container = document.getElementById('accounts-content');
  if (!container) return;
  try {
    const { accounts, totals } = await accountsApi.list();

    // Totals bar
    let html = `
      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:1.5rem;">
        <div class="stat-card" style="--card-accent:#10b981;">
          <div class="stat-label">${t('accounts.totalCash')}</div>
          <div class="stat-value">${formatTaka(totals.cash || 0)}</div>
          <div class="stat-icon">💵</div>
        </div>
        <div class="stat-card" style="--card-accent:#0ea5e9;">
          <div class="stat-label">${t('accounts.totalBank')}</div>
          <div class="stat-value">${formatTaka(totals.bank || 0)}</div>
          <div class="stat-icon">🏦</div>
        </div>
        <div class="stat-card" style="--card-accent:#6366f1;">
          <div class="stat-label">${t('accounts.totalAvailable')}</div>
          <div class="stat-value">${formatTaka((totals.cash || 0) + (totals.bank || 0))}</div>
          <div class="stat-icon">💰</div>
        </div>
      </div>
    `;

    // Group by type
    const grouped = {};
    accounts.forEach((a) => { if (!grouped[a.type]) grouped[a.type] = []; grouped[a.type].push(a); });

    for (const [type, accts] of Object.entries(grouped)) {
      html += `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-size:0.875rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">
            ${t(`accounts.types.${type}`)}
          </h2>
          <div class="grid-3">
            ${accts.map((a) => `
              <div class="stat-card" style="--card-accent:${type === 'cash' ? '#10b981' : type === 'bank' ? '#0ea5e9' : '#6366f1'};">
                <div class="stat-label">${a.name}</div>
                <div class="stat-value">${formatTaka(a.balance)}</div>
                <div class="flex gap-2" style="margin-top:0.75rem; flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary stmt-btn" data-id="${a.id}" data-name="${a.name}">📋 ${t('accounts.statement')}</button>
                  <button class="btn btn-sm btn-success dep-btn" data-id="${a.id}" data-name="${a.name}">↓ ${t('accounts.deposit')}</button>
                  <button class="btn btn-sm btn-danger wit-btn" data-id="${a.id}" data-name="${a.name}">↑ ${t('accounts.withdraw')}</button>
                  <button class="btn btn-sm btn-secondary trf-btn" data-id="${a.id}" data-name="${a.name}">↔ ${t('accounts.transfer')}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    container.querySelectorAll('.stmt-btn').forEach((b) => b.addEventListener('click', () => openStatement(b.dataset.id, b.dataset.name)));
    container.querySelectorAll('.dep-btn').forEach((b) => b.addEventListener('click', () => openDepositModal(b.dataset.id, b.dataset.name)));
    container.querySelectorAll('.wit-btn').forEach((b) => b.addEventListener('click', () => openWithdrawModal(b.dataset.id, b.dataset.name)));
    container.querySelectorAll('.trf-btn').forEach((b) => b.addEventListener('click', async () => {
      const all = await accountsApi.list();
      openTransferModal(b.dataset.id, b.dataset.name, all.accounts.filter((a) => a.id !== b.dataset.id));
    }));

  } catch (err) { handleApiError(err); }
}

async function openStatement(id, name) {
  const bodyEl = document.createElement('div');
  bodyEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  showModal({ title: `${t('accounts.statement')} — ${name}`, body: bodyEl, size: 'xl',
    footer: [{ label: t('app.close'), class: 'btn-secondary', action: ({ close }) => close() }] });
  try {
    const { transactions } = await accountsApi.statement(id, { limit: 100 });
    if (!transactions.length) { bodyEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t('app.noData')}</div></div>`; return; }
    bodyEl.innerHTML = `<div class="table-wrapper"><table class="table"><thead><tr><th>${t('app.date')}</th><th>Type</th><th>${t('ledger.description')}</th><th class="text-right">${t('ledger.debit')}</th><th class="text-right">${t('ledger.credit')}</th><th class="text-right">${t('app.balance')}</th></tr></thead>
      <tbody>${transactions.map((r) => `<tr><td style="font-size:0.8rem;">${formatDateTime(r.created_at)}</td><td><span class="badge badge-muted">${t(`accounts.txnTypes.${r.transaction_type}`) || r.transaction_type}</span></td><td style="font-size:0.8rem;">${r.description || '—'}</td><td class="text-right amount ${parseFloat(r.amount) > 0 ? 'positive' : ''}">${parseFloat(r.amount) > 0 ? formatTaka(r.amount) : '—'}</td><td class="text-right amount ${parseFloat(r.amount) < 0 ? 'negative' : ''}">${parseFloat(r.amount) < 0 ? formatTaka(Math.abs(r.amount)) : '—'}</td><td class="text-right amount">${formatTaka(r.balance_after)}</td></tr>`).join('')}</tbody></table></div>`;
  } catch (err) { bodyEl.innerHTML = `<p>${err.message}</p>`; }
}

function openDepositModal(id, name) {
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group"><label class="form-label">${t('accounts.amount')} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t('accounts.description')}</label><input name="description" class="form-control" /></div>
  `;
  showModal({
    title: `${t('accounts.deposit')} — ${name}`, body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('accounts.deposit'), class: 'btn-success', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (!data.amount) { showError(t('accounts.amount') + ' required'); return; }
        try { await accountsApi.deposit(id, data); showSuccess(t('accounts.deposited')); close(); loadAccounts(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

function openWithdrawModal(id, name) {
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group"><label class="form-label">${t('accounts.amount')} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t('accounts.description')}</label><input name="description" class="form-control" /></div>
  `;
  showModal({
    title: `${t('accounts.withdraw')} — ${name}`, body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('accounts.withdraw'), class: 'btn-danger', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        try { await accountsApi.withdraw(id, data); showSuccess(t('accounts.withdrawn')); close(); loadAccounts(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

function openTransferModal(fromId, fromName, otherAccounts) {
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group"><label class="form-label">${t('accounts.transferTo')} *</label>
      <select name="to_account_id" class="form-control" required>
        <option value="">${t('app.selectOption')}</option>
        ${otherAccounts.map((a) => `<option value="${a.id}">${a.name} (${formatTaka(a.balance)})</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">${t('accounts.amount')} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t('app.notes')}</label><input name="notes" class="form-control" /></div>
  `;
  showModal({
    title: `${t('accounts.transfer')} — ${fromName}`, body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('accounts.transfer'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        try { await accountsApi.transfer(fromId, data); showSuccess(t('accounts.transferred')); close(); loadAccounts(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

function openAccountModal(id) {
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group"><label class="form-label">${t('accounts.name')} *</label><input name="name" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t('accounts.type')} *</label>
      <select name="type" class="form-control" required>
        ${['cash','bank'].map((tp) => `<option value="${tp}">${t(`accounts.types.${tp}`)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Opening Balance</label><input name="opening_balance" type="number" min="0" step="0.01" class="form-control" value="0" /></div>
  `;
  showModal({
    title: t('accounts.add'), body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        try { await accountsApi.create(data); showSuccess(t('accounts.saved')); close(); loadAccounts(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}
