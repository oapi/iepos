/**
 * Categories Page — List + CRUD
 */
import { t } from '../../core/i18n.js';
import { categoriesApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';

let categories = [];

export async function renderCategories(outlet) {
  setTopbarTitle(t('categories.title'));

  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('categories.title')}</h1>
      <div class="flex gap-2">
        <button class="btn btn-primary" id="add-category-btn">+ ${t('categories.add')}</button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th style="width:70px;">${t('categories.sortOrder')}</th>
            <th>${t('categories.name')}</th>
            <th>${t('categories.nameBn')}</th>
            <th>${t('categories.slug')}</th>
            <th>${t('app.status')}</th>
            <th>${t('app.actions')}</th>
          </tr>
        </thead>
        <tbody id="categories-tbody">
          <tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
    </div>
  `;

  await loadCategories();
  bindEvents();
}

async function loadCategories() {
  const tbody = document.getElementById('categories-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>`;

  try {
    const data = await categoriesApi.list();
    categories = data.categories || [];

    if (!tbody) return;
    if (!categories.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">🏷</div>
              <div class="empty-state-title">${t('app.noData')}</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = categories.map((c) => `
      <tr>
        <td style="font-weight:600; color:var(--text-muted);">${c.sort_order ?? 0}</td>
        <td style="font-weight:600;">${c.name}</td>
        <td>${c.name_bn || '—'}</td>
        <td style="font-family:monospace; font-size:0.85rem; color:var(--text-secondary);">${c.slug}</td>
        <td>
          <span class="badge ${c.is_active ? 'badge-success' : 'badge-muted'}">
            ${c.is_active ? t('app.active') : t('app.inactive')}
          </span>
        </td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-cat-btn" data-id="${c.id}" title="${t('app.edit')}">✏</button>
            <button class="btn btn-sm btn-danger del-cat-btn" data-id="${c.id}" title="${t('app.delete')}">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.edit-cat-btn').forEach((b) => {
      b.addEventListener('click', () => {
        const cat = categories.find((c) => c.id === parseInt(b.dataset.id));
        if (cat) openCategoryModal(cat);
      });
    });

    tbody.querySelectorAll('.del-cat-btn').forEach((b) => {
      b.addEventListener('click', () => deleteCategory(parseInt(b.dataset.id)));
    });
  } catch (err) {
    handleApiError(err);
  }
}

function bindEvents() {
  document.getElementById('add-category-btn')?.addEventListener('click', () => openCategoryModal(null));
}

function openCategoryModal(cat) {
  const isEdit = !!cat;
  const title = isEdit ? t('categories.edit') : t('categories.add');

  const content = `
    <form id="category-modal-form">
      <div class="form-group">
        <label class="form-label">${t('categories.name')} *</label>
        <input name="name" class="form-control" value="${cat?.name || ''}" required placeholder="e.g. Steel Rod" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('categories.nameBn')}</label>
        <input name="name_bn" class="form-control" value="${cat?.name_bn || ''}" placeholder="e.g. রড" />
      </div>
      <div class="form-group">
        <label class="form-label">${t('categories.slug')} *</label>
        <input name="slug" class="form-control" value="${cat?.slug || ''}" required placeholder="e.g. steel-rod" />
      </div>
      <div class="form-row cols-2">
        <div class="form-group">
          <label class="form-label">${t('categories.sortOrder')}</label>
          <input name="sort_order" type="number" class="form-control" value="${cat?.sort_order ?? 0}" />
        </div>
        <div class="form-group" style="display:flex; align-items:center; margin-top:1.8rem;">
          <label class="form-check">
            <input name="is_active" type="checkbox" ${!isEdit || cat?.is_active ? 'checked' : ''} />
            <span>${t('app.active')}</span>
          </label>
        </div>
      </div>
    </form>
  `;

  showModal({
    title,
    content,
    buttons: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      {
        label: t('app.save'),
        class: 'btn-primary',
        action: async ({ close }) => {
          const form = document.getElementById('category-modal-form');
          if (!form) return;
          const formData = new FormData(form);
          const data = {
            name: formData.get('name').trim(),
            name_bn: formData.get('name_bn').trim() || null,
            slug: formData.get('slug').trim().toLowerCase().replace(/\s+/g, '-'),
            sort_order: parseInt(formData.get('sort_order')) || 0,
            is_active: formData.get('is_active') === 'on',
          };

          if (!data.name || !data.slug) {
            showError(t('categories.name') + ' and ' + t('categories.slug') + ' are required');
            return;
          }

          try {
            if (isEdit) {
              await categoriesApi.update(cat.id, data);
            } else {
              await categoriesApi.create(data);
            }
            showSuccess(t('categories.saved'));
            close();
            loadCategories();
          } catch (err) {
            showError(err.message || 'Failed to save category');
          }
        },
      },
    ],
  });
}

async function deleteCategory(id) {
  const ok = await confirmDialog({
    title: t('app.delete'),
    message: t('confirm.deleteItem'),
    type: 'danger',
    confirmLabel: t('app.delete'),
  });
  if (!ok) return;

  try {
    await categoriesApi.delete(id);
    showSuccess(t('categories.deleted'));
    loadCategories();
  } catch (err) {
    if (err.status === 409) {
      showError(t('categories.hasProducts'));
    } else {
      handleApiError(err);
    }
  }
}
