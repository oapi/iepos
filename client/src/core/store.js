/**
 * CoreTrade ERP — Global State Store
 * Simple reactive state without external dependencies
 */

const state = {
  user: null,
  settings: {},
  isLoading: false,
};

const subscribers = new Map();

export function getState(key) {
  return key ? state[key] : { ...state };
}

export function setState(key, value) {
  state[key] = value;
  (subscribers.get(key) || []).forEach((fn) => fn(value));
  (subscribers.get('*') || []).forEach((fn) => fn({ key, value }));
}

export function subscribe(key, fn) {
  if (!subscribers.has(key)) subscribers.set(key, []);
  subscribers.get(key).push(fn);
  return () => {
    const list = subscribers.get(key) || [];
    const idx = list.indexOf(fn);
    if (idx > -1) list.splice(idx, 1);
  };
}

// Convenience
export const store = {
  get user() { return state.user; },
  set user(v) { setState('user', v); },
  get settings() { return state.settings; },
  set settings(v) { setState('settings', v); },
  isAuthenticated: () => !!state.user,
  isAdmin: () => state.user?.role === 'admin',
  isManager: () => ['admin', 'manager'].includes(state.user?.role),
  isCashier: () => !!state.user,
};
