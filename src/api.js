const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  let data = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) data = await response.json(); else if (contentType.includes('text/')) data = await response.text(); else data = await response.blob()
  if (!response.ok) { const message = data?.error || data?.message || `Request failed (${response.status})`; const error = new Error(message); error.status = response.status; throw error }
  return data
}

export const api = {
  me: () => request('/auth/me'), login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }), signup: (name, email, password) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }), logout: () => request('/auth/logout', { method: 'POST' }),
  adminUsers: () => request('/admin/users'), business: () => request('/business'), saveBusiness: (body) => request('/business', { method: 'PUT', body: JSON.stringify(body) }),
  products: ({ search = '', page = 1, limit = 50 } = {}) => request(`/products?${new URLSearchParams({ search, page, limit })}`), product: (id) => request(`/products/${id}`), createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }), updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }), deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  customers: ({ search = '', page = 1, limit = 50 } = {}) => request(`/customers?${new URLSearchParams({ search, page, limit })}`), customer: (id) => request(`/customers/${id}`), createCustomer: (body) => request('/customers', { method: 'POST', body: JSON.stringify(body) }), updateCustomer: (id, body) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }), deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  invoices: (params = {}) => { const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')); return request(`/invoices?${new URLSearchParams(clean)}`) },
  invoice: (id) => request(`/invoices/${id}`), createInvoice: (body) => request('/invoices', { method: 'POST', body: JSON.stringify(body) }), deleteInvoice: (id) => request('/invoices/' + id, { method: 'DELETE' }), cancelInvoice: (id) => request(`/invoices/${id}/cancel`, { method: 'POST' }),
  updatePayment: (id, body) => request(`/invoices/${id}/payment`, { method: 'POST', body: JSON.stringify(body) }),
  invoicePdf: async (id) => { const response = await fetch(`${API_BASE_URL}/invoices/${id}/pdf`, { credentials: 'include' }); if (!response.ok) { let message = `PDF request failed (${response.status})`; try { message = (await response.json()).error || message } catch {} throw new Error(message) } return response.blob() },
  adjustStock: (productId, quantityChange, reason) => request('/inventory/adjust', { method: 'POST', body: JSON.stringify({ productId, quantityChange, reason }) }), inventoryMovements: (params = {}) => request(`/inventory/movements?${new URLSearchParams(params)}`),
}

export function saveBlob(blob, filename) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url) }
export function money(paise) { return `₹${(Number(paise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
export function prettyDate(value) { if (!value) return '—'; const date = new Date(value); if (Number.isNaN(date.getTime())) return String(value); return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
export function paymentMethodLabel(value) { return ({ 0: 'Cash', 1: 'UPI', 2: 'Bank', 3: 'Credit', 4: 'Other' })[Number(value)] || 'Other' }
export { API_BASE_URL }
