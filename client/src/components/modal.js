/**
 * CoreTrade ERP — Modal & Confirmation Dialog
 * No browser alert() or confirm() — all custom
 */
import { t } from '../core/i18n.js';

/**
 * Show a modal dialog
 * @param {object} options
 * @param {string} options.title
 * @param {string|HTMLElement} options.body
 * @param {string} options.size - sm|md|lg|xl
 * @param {Array<{label, class, action}>} options.footer - buttons
 * @param {boolean} options.closable
 * @returns {{ el, close }}
 */
export function showModal({ title, body, size = 'md', footer = [], closable = true }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title);

  const footerHtml = footer.map((btn, i) => `
    <button class="btn ${btn.class || 'btn-secondary'}" data-action="${i}" id="modal-btn-${i}">
      ${btn.label}
    </button>
  `).join('');

  overlay.innerHTML = `
    <div class="modal modal-${size}">
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        ${closable ? `<button class="modal-close" aria-label="${t('app.close')}">✕</button>` : ''}
      </div>
      <div class="modal-body"></div>
      ${footer.length ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;

  const modalBody = overlay.querySelector('.modal-body');
  if (typeof body === 'string') {
    modalBody.innerHTML = body;
  } else {
    modalBody.appendChild(body);
  }

  const close = () => {
    overlay.style.animation = 'fadeIn 0.15s ease reverse';
    setTimeout(() => overlay.remove(), 150);
  };

  if (closable) {
    overlay.querySelector('.modal-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }

  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape' && closable) { close(); document.removeEventListener('keydown', esc); }
  });

  footer.forEach((btn, i) => {
    overlay.querySelector(`[data-action="${i}"]`)?.addEventListener('click', () => {
      btn.action?.({ close });
    });
  });

  document.body.appendChild(overlay);

  // Focus first button
  setTimeout(() => {
    const firstBtn = overlay.querySelector('.modal-footer .btn') || overlay.querySelector('.modal-close');
    firstBtn?.focus();
  }, 50);

  return { el: overlay, close };
}

/**
 * Show a confirmation dialog
 * Returns a promise that resolves to true/false
 */
export function confirmDialog({
  title = t('confirm.title'),
  message,
  confirmLabel = t('app.confirm'),
  cancelLabel = t('app.cancel'),
  type = 'danger',
  details,
}) {
  return new Promise((resolve) => {
    const body = `
      <div style="text-align:center; padding: 0.5rem 0;">
        <div style="font-size:2.5rem; margin-bottom:1rem; opacity:0.7;">
          ${type === 'danger' ? '⚠️' : '❓'}
        </div>
        <p style="color: var(--text-primary); font-size:1rem; font-weight:500; margin-bottom:0.5rem;">
          ${message || t('confirm.irreversible')}
        </p>
        ${details ? `<p style="color:var(--text-muted); font-size:0.8rem; margin-top:0.5rem;">${details}</p>` : ''}
      </div>
    `;

    const { close } = showModal({
      title,
      body,
      size: 'sm',
      closable: true,
      footer: [
        {
          label: cancelLabel,
          class: 'btn-secondary',
          action: ({ close }) => { close(); resolve(false); },
        },
        {
          label: confirmLabel,
          class: type === 'danger' ? 'btn-danger' : 'btn-primary',
          action: ({ close }) => { close(); resolve(true); },
        },
      ],
    });

    // If user closes modal via X or Escape
    const observer = new MutationObserver(() => {
      if (!document.body.contains(close)) {
        resolve(false);
        observer.disconnect();
      }
    });
  });
}

/**
 * Simple form modal wrapper
 */
export function formModal({ title, formHtml, size = 'md', onSubmit }) {
  const formEl = document.createElement('form');
  formEl.innerHTML = formHtml;

  const { close } = showModal({
    title,
    body: formEl,
    size,
    footer: [
      { label: t('app.cancel'), class: 'btn-secondary', action: ({ close }) => close() },
      { label: t('app.save'), class: 'btn-primary', action: async ({ close }) => {
        const data = Object.fromEntries(new FormData(formEl));
        const ok = await onSubmit(data, formEl, close);
        if (ok) close();
      }},
    ],
  });

  return { close, form: formEl };
}
