/**
 * POS (Point of Sale) Page
 * Optimized for fast transaction entry
 */
import { t, formatTaka } from '../../core/i18n.js';
import { productsApi, salesApi, customersApi, accountsApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { confirmDialog } from '../../components/modal.js';
import { navigate } from '../../core/router.js';

let cart = [];
let customers = [];
let accounts = [];

export async function renderPOS(outlet) {
  setTopbarTitle(t('pos.title'));
  cart = [];

  outlet.innerHTML = `
    <div class="pos-layout">
      <!-- Left: Product Search + Results -->
      <div class="pos-products">
        <div class="pos-search">
          <div class="search-input-wrapper" style="max-width:100%;">
            <span class="search-icon">🔍</span>
            <input type="text" id="pos-search" class="form-control"
              placeholder="${t('pos.searchProduct')}"
              autocomplete="off" autocorrect="off" spellcheck="false" />
          </div>
        </div>
        <div class="pos-product-results" id="pos-results">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">${t('pos.searchProduct')}</div>
          </div>
        </div>
      </div>

      <!-- Right: Cart -->
      <div class="pos-cart">
        <div class="cart-header">
          <span style="font-weight:600; color:var(--text-primary);">
            🛒 ${t('pos.cart')}
          </span>
          <button class="btn btn-ghost btn-sm" id="clear-cart-btn">🗑 ${t('pos.clearCart')}</button>
        </div>

        <div class="cart-items" id="cart-items">
          <div class="empty-state" id="cart-empty">
            <div class="empty-state-icon">🛒</div>
            <div class="empty-state-text">${t('pos.emptyCart')}</div>
          </div>
        </div>

        <div class="cart-summary" id="cart-summary">
          <!-- Sale type -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t('pos.saleType')}</label>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-sm sale-type-btn active" data-type="cash" id="type-cash">💵 ${t('pos.cashSale')}</button>
              <button class="btn btn-sm sale-type-btn" data-type="credit" id="type-credit">📋 ${t('pos.creditSale')}</button>
              <button class="btn btn-sm sale-type-btn" data-type="wholesale" id="type-wholesale">📦 ${t('pos.wholesaleSale')}</button>
            </div>
          </div>

          <!-- Customer (shown for credit) -->
          <div class="form-group" id="customer-group" style="display:none; margin-bottom:0.75rem;">
            <label class="form-label">${t('pos.selectCustomer')} <span class="required-star">*</span></label>
            <select class="form-control" id="pos-customer">
              <option value="">${t('app.selectOption')}</option>
            </select>
          </div>

          <!-- Account -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t('pos.paymentAccount')}</label>
            <select class="form-control" id="pos-account">
              <option value="">${t('app.selectOption')}</option>
            </select>
          </div>

          <!-- Totals -->
          <div style="border-top:1px solid var(--border); padding-top:0.75rem; margin-bottom:0.75rem;">
            <div class="cart-summary-row">
              <span>${t('app.subtotal')}</span>
              <span class="text-taka" id="summary-subtotal">৳ 0.00</span>
            </div>
            <div class="cart-summary-row">
              <span>${t('app.discount')}</span>
              <input type="number" id="cart-discount" class="form-control"
                style="width:100px; text-align:right; padding:2px 8px; height:28px;"
                value="0" min="0" step="0.01" />
            </div>
            <div class="cart-summary-row total">
              <span>${t('app.total')}</span>
              <span class="text-taka" id="summary-total">৳ 0.00</span>
            </div>
          </div>

          <!-- Payment -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t('pos.amountPaid')}</label>
            <input type="number" id="amount-paid" class="form-control"
              value="0" min="0" step="0.01" />
          </div>

          <div class="cart-summary-row" style="font-size:0.875rem;">
            <span>${t('pos.changeDue')}</span>
            <span id="summary-change" class="text-taka" style="color:var(--color-success);">৳ 0.00</span>
          </div>

          <div class="cart-summary-row" style="font-size:0.875rem;">
            <span>${t('app.due')}</span>
            <span id="summary-due" class="text-taka" style="color:var(--color-warning);">৳ 0.00</span>
          </div>

          <!-- Notes -->
          <div class="form-group" style="margin-bottom:1rem; margin-top:0.5rem;">
            <textarea id="pos-notes" class="form-control"
              placeholder="${t('app.notes')} (${t('app.optional')})"
              rows="2" style="resize:none;"></textarea>
          </div>

          <button class="btn btn-success btn-full btn-lg" id="complete-sale-btn">
            ✓ ${t('pos.completeSale')}
          </button>
        </div>
      </div>
    </div>
  `;

  await loadPOSData();
  bindPOSEvents();
}

async function loadPOSData() {
  try {
    const [custData, acctData] = await Promise.all([
      customersApi.list({ limit: 500 }),
      accountsApi.list(),
    ]);

    customers = custData.customers || [];
    accounts = (acctData.accounts || []).filter((a) => a.type !== 'capital');

    const custSel = document.getElementById('pos-customer');
    const acctSel = document.getElementById('pos-account');

    if (custSel) {
      customers.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}${c.phone ? ` (${c.phone})` : ''} — ${t('app.due')}: ${formatTaka(c.balance)}`;
        custSel.appendChild(opt);
      });
    }

    if (acctSel) {
      accounts.forEach((a) => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.name} — ${formatTaka(a.balance)}`;
        if (a.is_default) opt.selected = true;
        acctSel.appendChild(opt);
      });
    }
  } catch (err) {
    handleApiError(err);
  }
}

function bindPOSEvents() {
  let searchTimeout;

  // Product search
  document.getElementById('pos-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const q = e.target.value.trim();
    if (q.length < 1) {
      showProductsEmpty();
      return;
    }
    searchTimeout = setTimeout(() => searchProducts(q), 200);
  });

  // Sale type buttons
  document.querySelectorAll('.sale-type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sale-type-btn').forEach((b) => {
        b.classList.remove('active', 'btn-primary', 'btn-warning', 'btn-secondary');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');

      const type = btn.dataset.type;
      const customerGroup = document.getElementById('customer-group');
      if (customerGroup) {
        customerGroup.style.display = type === 'credit' ? 'block' : 'none';
      }
      updateSummary();
    });
  });

  // Initialize button styles
  document.getElementById('type-cash')?.classList.add('btn-primary');
  document.querySelectorAll('.sale-type-btn:not(#type-cash)').forEach((b) => b.classList.add('btn-secondary'));

  // Cart discount & payment updates
  document.getElementById('cart-discount')?.addEventListener('input', updateSummary);
  document.getElementById('amount-paid')?.addEventListener('input', updateSummary);

  // Clear cart
  document.getElementById('clear-cart-btn')?.addEventListener('click', async () => {
    if (cart.length === 0) return;
    const ok = await confirmDialog({ message: t('pos.clearCartConfirm'), type: 'warning' });
    if (ok) { cart = []; renderCart(); }
  });

  // Complete sale
  document.getElementById('complete-sale-btn')?.addEventListener('click', completeSale);
}

async function searchProducts(q) {
  const resultsEl = document.getElementById('pos-results');
  if (!resultsEl) return;
  resultsEl.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  try {
    const { products } = await productsApi.search(q);
    if (!products.length) {
      resultsEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">${t('app.noData')}</div>
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = products.map((p) => `
      <div class="pos-product-card" data-product='${JSON.stringify(p)}'>
        <div class="pos-product-name">${p.name}</div>
        ${p.sku ? `<div class="pos-product-sku">${p.sku}${p.brand ? ` · ${p.brand}` : ''}${p.size ? ` · ${p.size}` : ''}</div>` : ''}
        <div class="pos-product-price">${formatTaka(p.retail_price)}</div>
        <div class="pos-product-stock ${parseFloat(p.current_stock) <= 0 ? 'low' : ''}">
          ${t('inventory.movementTypes.opening')}: ${p.current_stock} ${p.unit}
        </div>
      </div>
    `).join('');

    resultsEl.querySelectorAll('.pos-product-card').forEach((card) => {
      card.addEventListener('click', () => {
        const product = JSON.parse(card.dataset.product);
        addToCart(product);
      });
    });
  } catch (err) {
    handleApiError(err);
    showProductsEmpty();
  }
}

function showProductsEmpty() {
  const resultsEl = document.getElementById('pos-results');
  if (!resultsEl) return;
  resultsEl.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">${t('pos.searchProduct')}</div>
    </div>
  `;
}

function addToCart(product) {
  const existing = cart.find((i) => i.product_id === product.id);
  if (existing) {
    existing.qty = parseFloat(existing.qty) + 1;
  } else {
    const saleType = document.querySelector('.sale-type-btn.active')?.dataset.type || 'cash';
    const price = saleType === 'wholesale' ? product.wholesale_price : product.retail_price;
    cart.push({
      product_id: product.id,
      name: product.name,
      sku: product.sku,
      unit: product.unit,
      unit_price: parseFloat(price),
      qty: 1,
      discount: 0,
      max_stock: parseFloat(product.current_stock),
    });
  }
  renderCart();
  // Clear search and focus
  const searchEl = document.getElementById('pos-search');
  if (searchEl) { searchEl.value = ''; searchEl.focus(); }
  showProductsEmpty();
}

function renderCart() {
  const cartEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  if (!cartEl) return;

  if (cart.length === 0) {
    cartEl.innerHTML = `
      <div class="empty-state" id="cart-empty">
        <div class="empty-state-icon">🛒</div>
        <div class="empty-state-text">${t('pos.emptyCart')}</div>
      </div>
    `;
    updateSummary();
    return;
  }

  cartEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item" data-idx="${idx}">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-controls">
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t('pos.qty')} (${item.unit})</label>
          <input type="number" class="form-control item-qty"
            data-idx="${idx}" value="${item.qty}"
            min="0.001" max="${item.max_stock}" step="0.001"
            style="width:90px; height:30px; padding:2px 8px;" />
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t('pos.unitPrice')}</label>
          <input type="number" class="form-control item-price"
            data-idx="${idx}" value="${item.unit_price}"
            min="0" step="0.01"
            style="width:100px; height:30px; padding:2px 8px;" />
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t('pos.itemDiscount')}</label>
          <input type="number" class="form-control item-discount"
            data-idx="${idx}" value="${item.discount}"
            min="0" step="0.01"
            style="width:80px; height:30px; padding:2px 8px;" />
        </div>
        <span class="cart-item-total" id="item-total-${idx}">
          ${formatTaka(item.qty * item.unit_price - item.discount)}
        </span>
        <button class="btn btn-ghost btn-sm item-remove" data-idx="${idx}"
          title="${t('pos.removeItem')}">✕</button>
      </div>
    </div>
  `).join('');

  // Bind cart item events
  cartEl.querySelectorAll('.item-qty').forEach((input) => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      cart[idx].qty = parseFloat(e.target.value) || 0;
      updateItemTotal(idx);
      updateSummary();
    });
  });

  cartEl.querySelectorAll('.item-price').forEach((input) => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      cart[idx].unit_price = parseFloat(e.target.value) || 0;
      updateItemTotal(idx);
      updateSummary();
    });
  });

  cartEl.querySelectorAll('.item-discount').forEach((input) => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      cart[idx].discount = parseFloat(e.target.value) || 0;
      updateItemTotal(idx);
      updateSummary();
    });
  });

  cartEl.querySelectorAll('.item-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx);
      cart.splice(idx, 1);
      renderCart();
    });
  });

  updateSummary();
}

function updateItemTotal(idx) {
  const item = cart[idx];
  const total = Math.max(0, item.qty * item.unit_price - item.discount);
  const el = document.getElementById(`item-total-${idx}`);
  if (el) el.textContent = formatTaka(total);
}

function updateSummary() {
  const subtotal = cart.reduce((sum, i) => sum + Math.max(0, i.qty * i.unit_price - i.discount), 0);
  const discount = parseFloat(document.getElementById('cart-discount')?.value) || 0;
  const total = Math.max(0, subtotal - discount);
  const paid = parseFloat(document.getElementById('amount-paid')?.value) || 0;
  const change = Math.max(0, paid - total);
  const due = Math.max(0, total - paid);

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('summary-subtotal', formatTaka(subtotal));
  setText('summary-total', formatTaka(total));
  setText('summary-change', formatTaka(change));
  setText('summary-due', formatTaka(due));
}

async function completeSale() {
  if (cart.length === 0) { showError(t('pos.itemsRequired')); return; }

  // Validate
  for (const item of cart) {
    if (!item.unit_price || item.unit_price <= 0) { showError(t('pos.unitPriceRequired')); return; }
    if (!item.qty || item.qty <= 0) { showError(`${t('pos.qty')} required`); return; }
  }

  const saleType = document.querySelector('.sale-type-btn.active')?.dataset.type || 'cash';
  const customer_id = document.getElementById('pos-customer')?.value;
  const account_id = document.getElementById('pos-account')?.value;

  if (saleType === 'credit' && !customer_id) { showError(t('pos.customerRequired')); return; }
  if (!account_id && saleType !== 'credit') { showError(t('pos.accountRequired')); return; }

  const discount = parseFloat(document.getElementById('cart-discount')?.value) || 0;
  const paid = parseFloat(document.getElementById('amount-paid')?.value) || 0;
  const notes = document.getElementById('pos-notes')?.value;

  // Stock check warning
  for (const item of cart) {
    if (item.qty > item.max_stock) {
      showError(`${t('pos.insufficientStock')} "${item.name}". ${t('pos.available')}: ${item.max_stock} ${item.unit}`);
      return;
    }
  }

  const btn = document.getElementById('complete-sale-btn');
  if (btn) { btn.disabled = true; btn.textContent = t('pos.completingLoading'); }

  try {
    const payload = {
      sale_type: saleType,
      customer_id: customer_id || undefined,
      account_id: account_id || undefined,
      items: cart.map((i) => ({
        product_id: i.product_id,
        qty: i.qty,
        unit_price: i.unit_price,
        discount: i.discount,
      })),
      discount,
      paid,
      notes,
    };

    const { sale, message } = await salesApi.create(payload);
    showSuccess(`${t('pos.saleSuccess')} · ${t('pos.invoiceNo')}: ${sale.invoice_no}`);

    // Reset for next sale
    cart = [];
    renderCart();
    if (document.getElementById('cart-discount')) document.getElementById('cart-discount').value = '0';
    if (document.getElementById('amount-paid')) document.getElementById('amount-paid').value = '0';
    if (document.getElementById('pos-notes')) document.getElementById('pos-notes').value = '';
    document.getElementById('pos-search')?.focus();

  } catch (err) {
    showError(err.message || t('toast.serverError'));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = `✓ ${t('pos.completeSale')}`; }
  }
}
