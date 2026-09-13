/**
 * Products Page — List + CRUD
 */
import { t, formatTaka } from '../../core/i18n.js';
import { productsApi, categoriesApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';
import { navigate } from '../../core/router.js';

let products = [], categories = [], page = 1, totalProducts = 0;
let filters = { search: '', category_id: '', low_stock: '' };

export async function renderProducts(outlet) {
  setTopbarTitle(t('products.title'));

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('products.title')}</h1>
      <div class="flex gap-2">
        <button class="btn btn-secondary" onclick="location.hash='/categories'">🏷 ${t('categories.title')}</button>
        <button class="btn btn-primary" id="add-product-btn">+ ${t('products.add')}</button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="product-search" class="form-control" placeholder="${t('products.searchPlaceholder')}" />
      </div>
      <select class="form-control" id="category-filter" style="max-width:200px;">
        <option value="">${t('products.filterCategory')}</option>
      </select>
      <label class="form-check" style="color:var(--text-secondary); font-size:0.875rem;">
        <input type="checkbox" id="low-stock-filter" />
        ${t('products.showLowStock')}
      </label>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('products.sku')}</th>
          <th>${t('products.name')}</th>
          <th>${t('products.category')}</th>
          <th>${t('products.unit')}</th>
          <th class="text-right">${t('products.retailPrice')}</th>
          <th class="text-right">${t('products.currentStock')}</th>
          <th>${t('app.status')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="products-tbody">
          <tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="products-pagination"></div>
    </div>
  `;

  await loadCategories();
  await loadProducts();
  bindEvents();
}

async function loadCategories() {
  try {
    const { categories: cats } = await categoriesApi.list();
    categories = cats;
    const sel = document.getElementById('category-filter');
    cats.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      sel?.appendChild(opt);
    });
  } catch {}
}

async function loadProducts() {
  const tbody = document.getElementById('products-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;

  try {
    const params = { page, limit: 50, ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });

    const data = await productsApi.list(params);
    products = data.products;
    totalProducts = data.total;

    if (!tbody) return;
    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t('products.noProducts')}</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = products.map((p) => `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem;">${p.sku || '—'}</td>
        <td>
          <div style="font-weight:500;">${p.name}</div>
          ${p.brand ? `<div style="font-size:0.75rem; color:var(--text-muted);">${p.brand}${p.size ? ` · ${p.size}` : ''}</div>` : ''}
        </td>
        <td>${p.category_name || '—'}</td>
        <td>${p.unit}</td>
        <td class="text-right amount">${formatTaka(p.retail_price)}</td>
        <td class="text-right">
          <span class="${parseFloat(p.current_stock) <= parseFloat(p.low_stock_alert) ? 'text-warning' : ''}">
            ${p.current_stock}
            ${parseFloat(p.current_stock) <= parseFloat(p.low_stock_alert)
              ? `<span class="badge badge-warning" style="margin-left:4px;">${t('products.lowStockBadge')}</span>`
              : ''}
          </span>
        </td>
        <td><span class="badge ${p.is_active ? 'badge-success' : 'badge-muted'}">${p.is_active ? t('app.active') : t('app.inactive')}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${p.id}" title="${t('app.edit')}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${p.id}" title="${t('products.delete')}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.edit-btn').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.id)));
    tbody.querySelectorAll('.del-btn').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.id)));

    renderPagination(totalProducts, page, 50, 'products-pagination', (p) => { page = p; loadProducts(); });

  } catch (err) { handleApiError(err); }
}

function bindEvents() {
  let searchTimeout;
  document.getElementById('product-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { filters.search = e.target.value; page = 1; loadProducts(); }, 400);
  });

  document.getElementById('category-filter')?.addEventListener('change', (e) => {
    filters.category_id = e.target.value; page = 1; loadProducts();
  });

  document.getElementById('low-stock-filter')?.addEventListener('change', (e) => {
    filters.low_stock = e.target.checked ? 'true' : ''; page = 1; loadProducts();
  });

  document.getElementById('add-product-btn')?.addEventListener('click', () => openProductModal(null));
}

async function openProductModal(id) {
  let product = {};
  if (id) {
    try { const d = await productsApi.get(id); product = d.product; } catch (err) { handleApiError(err); return; }
  }

  const catOptions = categories.map((c) => `<option value="${c.id}" ${product.category_id === c.id ? 'selected' : ''}>${c.name}</option>`).join('');

  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t('products.basicInfo')}
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('products.name')} <span class="required-star">*</span></label>
        <input name="name" class="form-control" value="${product.name || ''}" required placeholder="${t('products.name')}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.nameBn')}</label>
        <input name="name_bn" class="form-control" value="${product.name_bn || ''}" placeholder="${t('products.nameBn')}" />
      </div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">${t('products.category')}</label>
        <select name="category_id" class="form-control"><option value="">${t('app.selectOption')}</option>${catOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.sku')}</label>
        <input name="sku" class="form-control" value="${product.sku || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.unit')} <span class="required-star">*</span></label>
        <select name="unit" class="form-control">
          ${['pcs','kg','ton','bag','m','ft','liter','bundle'].map((u) => `<option ${product.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t('products.brand')}</label>
        <input name="brand" class="form-control" value="${product.brand || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.size')}</label>
        <input name="size" class="form-control" value="${product.size || ''}" />
      </div>
    </div>

    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin:1rem 0 0.5rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t('products.pricing')}
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">${t('products.retailPrice')}</label>
        <input name="retail_price" type="number" min="0" step="0.01" class="form-control" value="${product.retail_price || 0}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.wholesalePrice')}</label>
        <input name="wholesale_price" type="number" min="0" step="0.01" class="form-control" value="${product.wholesale_price || 0}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('products.purchaseCost')}</label>
        <input name="purchase_cost" type="number" min="0" step="0.01" class="form-control" value="${product.purchase_cost || 0}" />
      </div>
    </div>

    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin:1rem 0 0.5rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t('products.inventory')}
    </div>
    <div class="form-row cols-2">
      ${!id ? `
      <div class="form-group">
        <label class="form-label">${t('products.openingStock')}</label>
        <input name="current_stock" type="number" min="0" step="0.001" class="form-control" value="0" />
      </div>` : ''}
      <div class="form-group">
        <label class="form-label">${t('products.lowStockAlert')}</label>
        <input name="low_stock_alert" type="number" min="0" step="0.001" class="form-control" value="${product.low_stock_alert || 5}" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">${t('app.notes')}</label>
      <textarea name="notes" class="form-control" rows="2">${product.notes || ''}</textarea>
    </div>
    ${id ? `
    <div class="form-check" style="margin-top:0.5rem;">
      <input type="checkbox" name="is_active" id="prod-active" ${product.is_active ? 'checked' : ''} />
      <label for="prod-active" class="form-label" style="margin:0;">${t('app.active')}</label>
    </div>` : ''}
  `;

  const { close } = showModal({
    title: id ? t('products.edit') : t('products.add'),
    body: formEl,
    size: 'lg',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (!data.name) { showError(t('products.name') + ' ' + t('app.required')); return; }
        data.is_active = formEl.querySelector('[name=is_active]')?.checked ?? true;

        try {
          if (id) {
            await productsApi.update(id, data);
          } else {
            await productsApi.create(data);
          }
          showSuccess(t('products.saved'));
          close();
          loadProducts();
        } catch (err) { showError(err.message); }
      }},
    ],
  });
}

async function deleteProduct(id) {
  const ok = await confirmDialog({ message: t('products.deleteConfirm'), type: 'warning' });
  if (!ok) return;
  try {
    await productsApi.delete(id);
    showSuccess(t('products.saved'));
    loadProducts();
  } catch (err) { handleApiError(err); }
}

function renderPagination(total, currentPage, limit, containerId, onPage) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const totalPages = Math.ceil(total / limit);
  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  container.innerHTML = `
    <span class="pagination-info">
      ${t('table.showing').replace('{from}', from).replace('{to}', to).replace('{total}', total)}
    </span>
    <div class="pagination-controls">
      <button class="btn btn-sm btn-secondary" ${currentPage <= 1 ? 'disabled' : ''} id="${containerId}-prev">
        ← ${t('table.prev')}
      </button>
      <span style="font-size:0.8rem; color:var(--text-muted);">${currentPage} / ${totalPages}</span>
      <button class="btn btn-sm btn-secondary" ${currentPage >= totalPages ? 'disabled' : ''} id="${containerId}-next">
        ${t('table.next')} →
      </button>
    </div>
  `;

  document.getElementById(`${containerId}-prev`)?.addEventListener('click', () => onPage(currentPage - 1));
  document.getElementById(`${containerId}-next`)?.addEventListener('click', () => onPage(currentPage + 1));
}

export { renderPagination };
