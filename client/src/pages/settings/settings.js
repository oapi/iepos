/**
 * Settings Page
 */
import { t, getLang, setLang } from '../../core/i18n.js';
import { settingsApi, authApi, backupApi } from '../../core/api.js';
import { store } from '../../core/store.js';
import { setTopbarTitle } from '../../components/shell.js';
import { showSuccess, showError, handleApiError } from '../../components/toast.js';
import { showModal, confirmDialog } from '../../components/modal.js';

export async function renderSettings(outlet) {
  setTopbarTitle(t('settings.title'));
  outlet.innerHTML = `
    <div class="page-header"><h1 class="page-title">${t('settings.title')}</h1></div>
    <div class="loading-spinner"><div class="spinner"></div></div>
  `;
  try {
    const { settings } = await settingsApi.get();
    renderSettingsForm(outlet, settings);
  } catch (err) { handleApiError(err); }
}

function renderSettingsForm(outlet, settings) {
  outlet.innerHTML = `
    <div class="page-header"><h1 class="page-title">${t('settings.title')}</h1></div>

    <div class="grid-2" style="gap:1.5rem;">
      <!-- Company Info -->
      <div class="card">
        <div class="card-header"><span class="card-title">🏢 ${t('settings.company')}</span></div>
        <form id="company-form">
          <div class="form-group">
            <label class="form-label">${t('settings.companyName')}</label>
            <input name="company_name" class="form-control" value="${settings.company_name || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.address')}</label>
            <textarea name="company_address" class="form-control" rows="2">${settings.company_address || ''}</textarea>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">${t('settings.phone')}</label>
              <input name="company_phone" class="form-control" value="${settings.company_phone || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('settings.email')}</label>
              <input name="company_email" type="email" class="form-control" value="${settings.company_email || ''}" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">${t('settings.currency')}</label>
              <input name="currency_symbol" class="form-control" value="${settings.currency_symbol || '৳'}" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('settings.language')}</label>
              <select name="default_language" class="form-control">
                <option value="en" ${settings.default_language === 'en' ? 'selected' : ''}>English</option>
                <option value="bn" ${settings.default_language === 'bn' ? 'selected' : ''}>বাংলা</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">💾 ${t('app.save')}</button>
        </form>
      </div>

      <!-- Password Change -->
      <div class="card">
        <div class="card-header"><span class="card-title">🔑 ${t('auth.changePassword')}</span></div>
        <form id="password-form">
          <div class="form-group">
            <label class="form-label">${t('auth.currentPassword')} *</label>
            <input name="current_password" type="password" class="form-control" required autocomplete="current-password" />
          </div>
          <div class="form-group">
            <label class="form-label">${t('auth.newPassword')} *</label>
            <input name="new_password" type="password" class="form-control" required minlength="6" autocomplete="new-password" placeholder="Min 6 characters" />
          </div>
          <div class="form-group">
            <label class="form-label">${t('auth.confirmPassword')} *</label>
            <input name="confirm_password" type="password" class="form-control" required autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary">🔑 ${t('auth.changePassword')}</button>
        </form>
      </div>

      <!-- Backup & Restore (Admin only) -->
      ${store.isAdmin() ? `
        <div class="card" style="grid-column:1 / -1;">
          <div class="card-header"><span class="card-title">💾 ${t('nav.backup')} & ${t('reports.statement')}</span></div>
          <div style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center; justify-content:space-between;">
            <div>
              <p style="margin:0 0 0.5rem 0; color:var(--text-secondary); font-size:0.9rem;">
                Export a full JSON backup of all business records (products, customers, sales, purchases, inventory, accounts).
              </p>
              <button class="btn btn-primary" id="export-backup-btn">
                ⬇ Download JSON Backup
              </button>
            </div>
            <div style="border-left:1px solid var(--border); padding-left:1.5rem;">
              <p style="margin:0 0 0.5rem 0; color:var(--text-secondary); font-size:0.9rem;">
                Restore system data from a previously downloaded JSON backup file.
              </p>
              <label class="btn btn-secondary" style="cursor:pointer; display:inline-block;">
                ⬆ Restore from Backup
                <input type="file" id="import-backup-input" accept=".json" style="display:none;" />
              </label>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- System Info -->
      <div class="card" style="grid-column:1 / -1;">
        <div class="card-header"><span class="card-title">ℹ System Information</span></div>
        <div class="grid-3" style="gap:1rem;">
          <div>
            <div class="form-label">Application</div>
            <div style="font-weight:600;">${t('app.name')}</div>
          </div>
          <div>
            <div class="form-label">Logged in as</div>
            <div style="font-weight:600;">${store.user?.full_name} (${store.user?.role})</div>
          </div>
          <div>
            <div class="form-label">Version</div>
            <div style="font-weight:600;">1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('company-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await settingsApi.update(data);
      // Update app language if changed
      if (data.default_language && data.default_language !== getLang()) {
        setLang(data.default_language);
      }
      showSuccess(t('settings.saved'));
    } catch (err) { handleApiError(err); }
  });

  document.getElementById('password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (data.new_password !== data.confirm_password) { showError(t('validation.passwordMismatch')); return; }
    try {
      await authApi.changePassword({ current_password: data.current_password, new_password: data.new_password });
      showSuccess(t('auth.passwordChanged'));
      e.target.reset();
    } catch (err) { showError(err.message); }
  });

  // Backup Export
  document.getElementById('export-backup-btn')?.addEventListener('click', async () => {
    try {
      showSuccess('Generating backup...');
      const data = await backupApi.export();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coretrade_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      handleApiError(err);
    }
  });

  // Backup Import
  document.getElementById('import-backup-input')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ok = await confirmDialog({
      title: 'Restore Database',
      message: 'Restoring a backup will overwrite current tables with data from the backup file. Are you sure you want to proceed?',
      type: 'danger',
      confirmLabel: 'Restore Database',
    });
    if (!ok) {
      e.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const backupJson = JSON.parse(text);
      await backupApi.import(backupJson);
      showSuccess('Database restored successfully! Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showError(err.message || 'Failed to parse or restore backup');
    } finally {
      e.target.value = '';
    }
  });
}
