/**
 * Purchases Page — List + New Purchase Form
 */
import { t, formatTaka, formatDate } from '../../core/i18n.js';
import { purchasesApi, suppliersApi, productsApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal } from '../../components/modal.js';
import { renderPagination } from '../products/products.js';

let page = 1;
let filters = { start_date: '', end_date: '' };
let purchaseItems = [];

export async function renderPurchases(outlet) {
  setTopbarTitle(t('purchases.title'));
  const today = new Date().toISOString().slice(0, 10);

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('purchases.title')}</h1>
      <button class="btn btn-primary" id="new-purchase-btn">+ ${t('purchases.add')}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="pur-from" class="form-control" style="max-width:160px;" value="${today}" />
      <input type="date" id="pur-to" class="form-control" style="max-width:160px;" value="${today}" />
      <button class="btn btn-secondary" id="pur-filter-btn">🔍 ${t('app.filter')}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('purchases.invoice')}</th>
          <th>${t('purchases.date')}</th>
          <th>${t('purchases.supplier')}</th>
          <th class="text-right">${t('purchases.total')}</th>
          <th class="text-right">${t('purchases.paid')}</th>
          <th class="text-right">${t('purchases.due')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="purchases-tbody"><tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="purchases-pagination"></div>
    </div>
  `;

  filters.start_date = today;
  filters.end_date = today;
  await loadPurchases();

  document.getElementById('pur-filter-btn')?.addEventListener('click', () => {
    filters.start_date = document.getElementById('pur-from')?.value;
    filters.end_date = document.getElementById('pur-to')?.value;
    page = 1; loadPurchases();
  });
  document.getElementById('new-purchase-btn')?.addEventListener('click', () => openNewPurchaseModal());
}

async function loadPurchases() {
  const tbody = document.getElementById('purchases-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;
  try {
    const params = { page, limit: 50, ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const data = await purchasesApi.list(params);
    const purchases = data.purchases;
    if (!purchases.length) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t('purchases.noPurchases')}</div></div></td></tr>`;
      return;
    }
    if (tbody) tbody.innerHTML = purchases.map((p) => `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; font-weight:600;">${p.invoice_no}</td>
        <td>${formatDate(p.purchase_date)}</td>
        <td>${p.supplier_name || '—'}</td>
        <td class="text-right amount">${formatTaka(p.total)}</td>
        <td class="text-right amount positive">${formatTaka(p.paid)}</td>
        <td class="text-right amount ${parseFloat(p.due) > 0 ? 'negative' : ''}">${formatTaka(p.due)}</td>
        <td><button class="btn btn-sm btn-secondary view-btn" data-id="${p.id}">👁</button></td>
      </tr>
    `).join('');
    tbody?.querySelectorAll('.view-btn').forEach((b) => b.addEventListener('click', () => openDetail(b.dataset.id)));
    renderPagination(data.total, page, 50, 'purchases-pagination', (p) => { page = p; loadPurchases(); });
  } catch (err) { handleApiError(err); }
}

async function openDetail(id) {
  const bodyEl = document.createElement('div');
  bodyEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  showModal({ title: t('purchases.title'), body: bodyEl, size: 'lg',
    footer: [{ label: t('app.close'), class: 'btn-secondary', action: ({ close }) => close() }] });
  try {
    const { purchase, items } = await purchasesApi.get(id);
    bodyEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
        <div><div style="font-size:1.2rem; font-weight:700; font-family:monospace;">${purchase.invoice_no}</div><div style="color:var(--text-muted);">${formatDate(purchase.purchase_date)}</div></div>
      </div>
      ${purchase.supplier_name ? `<div style="margin-bottom:1rem; padding:0.75rem; background:var(--bg-base); border-radius:0.5rem;"><div style="font-size:0.75rem; color:var(--text-muted);">${t('purchases.supplier')}</div><div style="font-weight:600;">${purchase.supplier_name}</div></div>` : ''}
      <table class="table"><thead><tr><th>${t('pos.product')}</th><th class="text-right">${t('pos.qty')}</th><th class="text-right">${t('inventory.movementTypes.purchase')}</th><th class="text-right">${t('pos.itemTotal')}</th></tr></thead>
        <tbody>${items.map((i) => `<tr><td>${i.product_name}</td><td class="text-right">${i.qty}</td><td class="text-right amount">${formatTaka(i.unit_cost)}</td><td class="text-right amount">${formatTaka(i.total)}</td></tr>`).join('')}</tbody>
        <tfoot>
          <tr><td colspan="3" class="text-right" style="font-weight:700;">${t('app.total')}</td><td class="text-right amount" style="font-weight:700;">${formatTaka(purchase.total)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-success);">${t('app.paid')}</td><td class="text-right amount" style="color:var(--color-success);">${formatTaka(purchase.paid)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-warning);">${t('app.due')}</td><td class="text-right amount" style="color:var(--color-warning);">${formatTaka(purchase.due)}</td></tr>
        </tfoot>
      </table>
    `;
  } catch (err) { bodyEl.innerHTML = `<p>${err.message}</p>`; }
}

async function openNewPurchaseModal() {
  purchaseItems = [];
  let suppliers = [], accounts = [], products = [];
  try {
    const [sd, ad] = await Promise.all([suppliersApi.list({ limit: 500 }), accountsApi.list()]);
    suppliers = sd.suppliers;
    accounts = ad.accounts.filter((a) => a.type !== 'capital');
  } catch {}

  const today = new Date().toISOString().slice(0, 10);
  const wrapper = document.createElement('div');

  const render = () => {
    const subtotal = purchaseItems.reduce((s, i) => s + (i.qty * i.unit_cost - i.discount), 0);
    wrapper.innerHTML = `
      <div class="form-row cols-2" style="margin-bottom:1rem;">
        <div class="form-group">
          <label class="form-label">${t('purchases.supplier')}</label>
          <select id="pur-supplier" class="form-control">
            <option value="">${t('app.selectOption')}</option>
            ${suppliers.map((s) => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t('purchases.date')}</label>
          <input id="pur-date" type="date" class="form-control" value="${today}" />
        </div>
      </div>

      <!-- Product search for purchase -->
      <div class="form-group">
        <label class="form-label">${t('pos.searchProduct')}</label>
        <div style="display:flex; gap:0.5rem;">
          <input type="text" id="pur-prod-search" class="form-control" placeholder="${t('pos.searchProduct')}" />
          <button type="button" class="btn btn-secondary" id="pur-search-btn">🔍</button>
        </div>
        <div id="pur-search-results" style="margin-top:0.5rem;"></div>
      </div>

      <!-- Items table -->
      ${purchaseItems.length > 0 ? `
      <table class="table" style="margin-bottom:1rem;">
        <thead><tr><th>${t('pos.product')}</th><th class="text-right">${t('pos.qty')}</th><th class="text-right">Cost</th><th class="text-right">${t('app.discount')}</th><th class="text-right">${t('pos.itemTotal')}</th><th></th></tr></thead>
        <tbody>
          ${purchaseItems.map((item, idx) => `
            <tr class="item-row" data-idx="${idx}">
              <td>${item.name}</td>
              <td class="text-right"><input type="number" class="form-control item-qty" data-idx="${idx}" value="${item.qty}" min="0.001" step="0.001" style="width:80px; text-align:right;" /></td>
              <td class="text-right"><input type="number" class="form-control item-cost" data-idx="${idx}" value="${item.unit_cost}" min="0" step="0.01" style="width:100px; text-align:right;" /></td>
              <td class="text-right"><input type="number" class="form-control item-disc" data-idx="${idx}" value="${item.discount}" min="0" step="0.01" style="width:80px; text-align:right;" /></td>
              <td class="text-right amount item-total-cell">${formatTaka(item.qty * item.unit_cost - item.discount)}</td>
              <td><button type="button" class="btn btn-ghost btn-sm item-remove" data-idx="${idx}">✕</button></td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot><tr><td colspan="4" class="text-right font-semibold">${t('app.subtotal')}</td><td class="text-right amount pur-subtotal-cell">${formatTaka(subtotal)}</td><td></td></tr></tfoot>
      </table>` : `<div class="empty-state" style="padding:1.5rem;"><div class="empty-state-icon">📦</div><div class="empty-state-text">${t('pos.emptyCart')}</div></div>`}

      <div class="form-row cols-3">
        <div class="form-group">
          <label class="form-label">${t('app.discount')}</label>
          <input id="pur-discount" type="number" min="0" step="0.01" class="form-control" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('app.paid')}</label>
          <input id="pur-paid" type="number" min="0" step="0.01" class="form-control" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('payments.account')}</label>
          <select id="pur-account" class="form-control">
            <option value="">${t('app.selectOption')}</option>
            ${accounts.map((a) => `<option value="${a.id}" ${a.is_default ? 'selected' : ''}>${a.name}</option>`).join('')}
          </select>
        </div>
      </div>
    `;

    const updateTotals = () => {
      const sub = purchaseItems.reduce((s, i) => s + Math.max(0, i.qty * i.unit_cost - i.discount), 0);
      wrapper.querySelectorAll('.item-row').forEach((row, idx) => {
        const item = purchaseItems[idx];
        if (!item) return;
        const totalCell = row.querySelector('.item-total-cell');
        if (totalCell) totalCell.textContent = formatTaka(Math.max(0, item.qty * item.unit_cost - item.discount));
      });
      const subCell = wrapper.querySelector('.pur-subtotal-cell');
      if (subCell) subCell.textContent = formatTaka(sub);
    };

    // Bind item events
    wrapper.querySelectorAll('.item-qty').forEach((inp) => {
      inp.addEventListener('input', (e) => { purchaseItems[parseInt(e.target.dataset.idx)].qty = parseFloat(e.target.value) || 0; updateTotals(); });
    });
    wrapper.querySelectorAll('.item-cost').forEach((inp) => {
      inp.addEventListener('input', (e) => { purchaseItems[parseInt(e.target.dataset.idx)].unit_cost = parseFloat(e.target.value) || 0; updateTotals(); });
    });
    wrapper.querySelectorAll('.item-disc').forEach((inp) => {
      inp.addEventListener('input', (e) => { purchaseItems[parseInt(e.target.dataset.idx)].discount = parseFloat(e.target.value) || 0; updateTotals(); });
    });
    wrapper.querySelectorAll('.item-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => { purchaseItems.splice(parseInt(e.currentTarget.dataset.idx), 1); render(); });
    });

    // Product search
    const searchBtn = wrapper.querySelector('#pur-search-btn');
    const searchInp = wrapper.querySelector('#pur-prod-search');
    const searchRes = wrapper.querySelector('#pur-search-results');

    const doSearch = async () => {
      const q = searchInp?.value;
      if (!q) return;
      try {
        const { products } = await productsApi.search(q);
        if (!searchRes) return;
        searchRes.innerHTML = products.map((p) => `
          <button type="button" class="btn btn-secondary btn-sm pur-add-product" data-product='${JSON.stringify({ id: p.id, name: p.name, unit: p.unit, unit_cost: p.purchase_cost })}' style="margin:2px;">
            ${p.name} (${p.unit}) — ${formatTaka(p.purchase_cost)}
          </button>
        `).join('');
        searchRes.querySelectorAll('.pur-add-product').forEach((b) => {
          b.addEventListener('click', () => {
            const prod = JSON.parse(b.dataset.product);
            purchaseItems.push({ product_id: prod.id, name: prod.name, unit: prod.unit, qty: 1, unit_cost: prod.unit_cost, discount: 0 });
            if (searchInp) searchInp.value = '';
            if (searchRes) searchRes.innerHTML = '';
            render();
          });
        });
      } catch {}
    };
    searchBtn?.addEventListener('click', doSearch);
    searchInp?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
  };

  render();

  showModal({
    title: t('purchases.add'), body: wrapper, size: 'xl',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        if (!purchaseItems.length) { showError(t('pos.itemsRequired')); return; }
        const payload = {
          supplier_id: wrapper.querySelector('#pur-supplier')?.value || undefined,
          purchase_date: wrapper.querySelector('#pur-date')?.value,
          items: purchaseItems.map((i) => ({ product_id: i.product_id, qty: i.qty, unit_cost: i.unit_cost, discount: i.discount })),
          discount: parseFloat(wrapper.querySelector('#pur-discount')?.value) || 0,
          paid: parseFloat(wrapper.querySelector('#pur-paid')?.value) || 0,
          account_id: wrapper.querySelector('#pur-account')?.value || undefined,
        };
        try {
          const { purchase } = await purchasesApi.create(payload);
          showSuccess(`${t('purchases.saved')} · ${purchase.invoice_no}`);
          close(); loadPurchases();
        } catch (err) { showError(err.message); }
      }},
    ],
  });
}
