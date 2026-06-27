const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.ok ? res.json() : null;
}

export const api = {
  getCustomers: () => request('/api/customers').then(r => r.data),
  createCustomer: (payload) => request('/api/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(r => r.data),
  getWallets: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/customer_prepaid_travel_wallet${qs ? `?${qs}` : ''}`).then(r => r.data);
  },
  getWallet: (id) => request(`/api/customer_prepaid_travel_wallet/${id}`).then(r => r.data),
  getWalletDetail: (id) => request(`/api/customer_prepaid_travel_wallet/${id}/detail`).then(r => r.data),
  createWallet: (payload) => request('/api/customer_prepaid_travel_wallet', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(r => r.data),
  updateWallet: (id, payload) => request(`/api/customer_prepaid_travel_wallet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then(r => r.data),
  patchWalletStatus: (id, status) => request(`/api/customer_prepaid_travel_wallet/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }).then(r => r.data),
  transact: (id, payload) => request(`/api/customer_prepaid_travel_wallet/${id}/transact`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(r => r.data),
  getTransactions: () => request('/api/transactions').then(r => r.data),
  getDashboardSummary: () => request('/api/dashboard/summary').then(r => r.data),
  getReportsSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/reports/summary${qs ? `?${qs}` : ''}`).then(r => r.data);
  },
};

export default api;
