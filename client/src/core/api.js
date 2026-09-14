/**
 * CoreTrade ERP — API Client
 * Centralized fetch wrapper with error handling and auth
 */

export function getApiBaseUrl() {
  const saved = localStorage.getItem('server_url');
  if (saved && saved.trim()) {
    let clean = saved.trim().replace(/\/$/, '');
    if (!clean.endsWith('/api')) {
      clean += '/api';
    }
    return clean;
  }

  const isNative = window.Capacitor?.isNativePlatform?.() || 
                   window.location.protocol === 'file:' || 
                   (window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80'));

  if (isNative) {
    return 'http://10.0.2.2:5000/api';
  }

  return '/api';
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(method, path, body = null) {
  const token = localStorage.getItem('ct_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const opts = {
    method,
    credentials: 'include', // Send cookies
    headers,
  };
  if (body !== null) {
    opts.body = JSON.stringify(body);
  }

  const baseUrl = getApiBaseUrl();

  let res;
  try {
    res = await fetch(`${baseUrl}${path}`, opts);
  } catch {
    throw new ApiError('Network error — check Server URL or connection', 0, null);
  }

  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('json') ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new ApiError(msg, res.status, data);
  }

  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

export { ApiError };

// ─── Module-specific API helpers ──────────────────────────

export const authApi = {
  login: (u, p) => api.post('/auth/login', { username: u, password: p }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const usersApi = {
  list: () => api.get('/users'),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  resetPassword: (id, p) => api.post(`/users/${id}/reset-password`, { new_password: p }),
};

export const categoriesApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productsApi = {
  list: (params = {}) => api.get('/products?' + new URLSearchParams(params)),
  search: (q) => api.get(`/products/search?q=${encodeURIComponent(q)}`),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const customersApi = {
  list: (params = {}) => api.get('/customers?' + new URLSearchParams(params)),
  get: (id) => api.get(`/customers/${id}`),
  ledger: (id, params = {}) => api.get(`/customers/${id}/ledger?` + new URLSearchParams(params)),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const suppliersApi = {
  list: (params = {}) => api.get('/suppliers?' + new URLSearchParams(params)),
  get: (id) => api.get(`/suppliers/${id}`),
  ledger: (id, params = {}) => api.get(`/suppliers/${id}/ledger?` + new URLSearchParams(params)),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const salesApi = {
  list: (params = {}) => api.get('/sales?' + new URLSearchParams(params)),
  get: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  void: (id, reason) => api.post(`/sales/${id}/void`, { void_reason: reason }),
};

export const purchasesApi = {
  list: (params = {}) => api.get('/purchases?' + new URLSearchParams(params)),
  get: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post('/purchases', data),
};

export const paymentsApi = {
  customerList: (params = {}) => api.get('/payments/customers?' + new URLSearchParams(params)),
  customerCreate: (data) => api.post('/payments/customers', data),
  supplierList: (params = {}) => api.get('/payments/suppliers?' + new URLSearchParams(params)),
  supplierCreate: (data) => api.post('/payments/suppliers', data),
};

export const accountsApi = {
  list: () => api.get('/accounts'),
  get: (id) => api.get(`/accounts/${id}`),
  statement: (id, params = {}) => api.get(`/accounts/${id}/statement?` + new URLSearchParams(params)),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  deposit: (id, data) => api.post(`/accounts/${id}/deposit`, data),
  withdraw: (id, data) => api.post(`/accounts/${id}/withdraw`, data),
  transfer: (id, data) => api.post(`/accounts/${id}/transfer`, data),
};

export const inventoryApi = {
  movements: (params = {}) => api.get('/inventory/movements?' + new URLSearchParams(params)),
  lowStock: () => api.get('/inventory/low-stock'),
  summary: () => api.get('/inventory/summary'),
  adjust: (data) => api.post('/inventory/adjust', data),
};

export const expensesApi = {
  list: (params = {}) => api.get('/expenses?' + new URLSearchParams(params)),
  categories: () => api.get('/expenses/categories'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
};

export const reportsApi = {
  dashboard: () => api.get('/reports/dashboard'),
  profitLoss: (params) => api.get('/reports/profit-loss?' + new URLSearchParams(params)),
  sales: (params) => api.get('/reports/sales?' + new URLSearchParams(params)),
  purchases: (params) => api.get('/reports/purchases?' + new URLSearchParams(params)),
};

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const backupApi = {
  export: () => api.get('/backup/export'),
  import: (backupData) => api.post('/backup/import', { backup: backupData }),
};
