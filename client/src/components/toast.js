/**
 * CoreTrade ERP — Toast Notification System
 */
import { t } from '../core/i18n.js';

let container;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

/**
 * Show a toast notification
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {string} message
 * @param {number} duration ms (0 = no auto-dismiss)
 */
export function toast(type, message, duration = 4000) {
  const c = getContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <div class="toast-body">
      <div class="toast-title">${t(`toast.${type}`)}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  const dismiss = () => {
    el.classList.add('exiting');
    setTimeout(() => el.remove(), 250);
  };

  el.querySelector('.toast-close').addEventListener('click', dismiss);
  c.appendChild(el);

  if (duration > 0) setTimeout(dismiss, duration);
  return { dismiss };
}

export const showSuccess = (msg, d) => toast('success', msg, d);
export const showError = (msg, d) => toast('error', msg, d);
export const showWarning = (msg, d) => toast('warning', msg, d);
export const showInfo = (msg, d) => toast('info', msg, d);

/**
 * Handle API errors and show appropriate toast
 */
export function handleApiError(err) {
  if (err.status === 0) {
    showError(t('toast.networkError'));
  } else if (err.status === 401) {
    showError(t('toast.unauthorized'));
    setTimeout(() => { window.location.hash = '/login'; }, 1500);
  } else if (err.status === 403) {
    showError(t('toast.forbidden'));
  } else if (err.status >= 500) {
    showError(t('toast.serverError'));
  } else {
    showError(err.message || t('toast.serverError'));
  }
}
