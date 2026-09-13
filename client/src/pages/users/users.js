/**
 * Users Page — Admin only
 */
import { t, formatDateTime } from '../../core/i18n.js';
import { usersApi } from '../../core/api.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';

export async function renderUsers(outlet) {
  setTopbarTitle(t('users.title'));
  outlet.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${t('users.title')}</h1>
      <button class="btn btn-primary" id="add-user-btn">+ ${t('users.add')}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t('users.fullName')}</th>
          <th>${t('users.username')}</th>
          <th>${t('users.role')}</th>
          <th>${t('users.lastLogin')}</th>
          <th>${t('app.status')}</th>
          <th>${t('app.actions')}</th>
        </tr></thead>
        <tbody id="users-tbody"><tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
    </div>
  `;
  await loadUsers();
  document.getElementById('add-user-btn')?.addEventListener('click', () => openUserModal(null));
}

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  try {
    const { users } = await usersApi.list();
    if (!users.length) { if (tbody) tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-title">${t('users.noUsers')}</div></div></td></tr>`; return; }
    if (tbody) tbody.innerHTML = users.map((u) => `
      <tr>
        <td><div style="font-weight:500;">${u.full_name}</div></td>
        <td style="font-family:monospace; font-size:0.875rem;">${u.username}</td>
        <td>
          <span class="badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'manager' ? 'badge-info' : 'badge-muted'}">
            ${t(`users.roles.${u.role}`)}
          </span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${u.last_login ? formatDateTime(u.last_login) : '—'}</td>
        <td><span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">${u.is_active ? t('app.active') : t('app.inactive')}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${u.id}">✏</button>
            <button class="btn btn-sm btn-ghost reset-btn" data-id="${u.id}" title="${t('users.resetPassword')}">🔑</button>
            ${u.is_active ? `<button class="btn btn-sm btn-danger deact-btn" data-id="${u.id}">🚫</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
    tbody?.querySelectorAll('.edit-btn').forEach((b) => b.addEventListener('click', () => openUserModal(b.dataset.id)));
    tbody?.querySelectorAll('.reset-btn').forEach((b) => b.addEventListener('click', () => openResetPasswordModal(b.dataset.id)));
    tbody?.querySelectorAll('.deact-btn').forEach((b) => b.addEventListener('click', () => deactivateUser(b.dataset.id)));
  } catch (err) { handleApiError(err); }
}

async function openUserModal(id) {
  let user = {};
  if (id) { try { user = (await usersApi.get(id)).user; } catch (err) { handleApiError(err); return; } }

  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t('users.fullName')} *</label><input name="full_name" class="form-control" value="${user.full_name || ''}" required /></div>
      <div class="form-group"><label class="form-label">${t('users.username')} *</label><input name="username" class="form-control" value="${user.username || ''}" required autocapitalize="none" /></div>
    </div>
    ${!id ? `<div class="form-group"><label class="form-label">${t('users.password')} *</label><input name="password" type="password" class="form-control" required minlength="6" autocomplete="new-password" /></div>` : ''}
    <div class="form-group">
      <label class="form-label">${t('users.role')} *</label>
      <select name="role" class="form-control" required>
        ${['admin','manager','cashier'].map((r) => `
          <option value="${r}" ${user.role === r ? 'selected' : ''}>${t(`users.roles.${r}`)} — ${t(`users.roleDescriptions.${r}`)}</option>
        `).join('')}
      </select>
    </div>
    ${id ? `<div class="form-check"><input type="checkbox" name="is_active" ${user.is_active ? 'checked' : ''} /><label class="form-label" style="margin:0;">${t('app.active')}</label></div>` : ''}
  `;

  showModal({
    title: id ? t('users.edit') : t('users.add'), body: formEl, size: 'md',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        if (id) data.is_active = formEl.querySelector('[name=is_active]')?.checked ?? true;
        try { id ? await usersApi.update(id, data) : await usersApi.create(data); showSuccess(t('users.saved')); close(); loadUsers(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

async function openResetPasswordModal(id) {
  const formEl = document.createElement('form');
  formEl.innerHTML = `
    <div class="form-group"><label class="form-label">${t('users.newPassword')} *</label><input name="password" type="password" class="form-control" minlength="6" required autocomplete="new-password" placeholder="Min 6 characters" /></div>
  `;
  showModal({
    title: t('users.resetPassword'), body: formEl, size: 'sm',
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('users.resetPassword'), class: 'btn-primary', action: async ({ close }) => {
        const { password } = Object.fromEntries(new FormData(formEl));
        if (!password || password.length < 6) { showError('Password must be at least 6 characters'); return; }
        try { await usersApi.resetPassword(id, password); showSuccess(t('users.passwordReset')); close(); }
        catch (err) { showError(err.message); }
      }},
    ],
  });
}

async function deactivateUser(id) {
  const ok = await confirmDialog({ message: t('users.deactivateConfirm'), type: 'warning' });
  if (!ok) return;
  try { await usersApi.update(id, { is_active: false }); loadUsers(); }
  catch (err) { handleApiError(err); }
}
