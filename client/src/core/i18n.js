/**
 * CoreTrade ERP — i18n Engine
 * Dot-notation lookup with parameter interpolation
 */
import en from '../locales/en.js';
import bn from '../locales/bn.js';

const locales = { en, bn };
let currentLang = localStorage.getItem('ct_lang') || 'en';

const listeners = new Set();

/**
 * Get translation for a dot-notation key
 * @param {string} key - e.g. 'customer.add'
 * @param {object} params - e.g. { name: 'John' }
 */
export function t(key, params = {}) {
  const locale = locales[currentLang] || locales.en;
  const parts = key.split('.');
  let value = locale;

  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = value[part];
    } else {
      value = undefined;
      break;
    }
  }

  // Fallback to English if key missing in current locale
  if (value === undefined) {
    value = locales.en;
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }
  }

  // If still undefined, return the key (never show raw key to users in production)
  if (value === undefined || typeof value === 'object') {
    return key;
  }

  // Interpolate {params}
  return String(value).replace(/\{(\w+)\}/g, (_, k) =>
    params[k] !== undefined ? params[k] : `{${k}}`
  );
}

export function getLang() { return currentLang; }

export function setLang(lang) {
  if (!locales[lang]) return;
  currentLang = lang;
  localStorage.setItem('ct_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  // Notify all listeners to re-render
  listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Format a number as Bangladeshi Taka
 * Uses South Asian number grouping (lakh, crore)
 */
export function formatTaka(amount) {
  const num = parseFloat(amount) || 0;
  return '৳\u00a0' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format date as locale-appropriate string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(
      currentLang === 'bn' ? 'bn-BD' : 'en-GB',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  } catch {
    return dateStr;
  }
}

/**
 * Format date+time
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString(
      currentLang === 'bn' ? 'bn-BD' : 'en-GB',
      { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  } catch {
    return dateStr;
  }
}

// Apply language on load
document.documentElement.lang = currentLang;
document.documentElement.setAttribute('data-lang', currentLang);
