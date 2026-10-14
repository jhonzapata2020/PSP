/**
 * Cliente HTTP para la API de Pedidos y Carrito (Psp.Orders.services).
 * Sigue el mismo estilo de api.js y productsApi.js:
 * Adjunta el JWT de sesión y normaliza los errores a { status, message }.
 */

const BASE_ORDERS_URL = (import.meta.env.VITE_ORDERS_URL || 'http://localhost:5107').replace(/\/$/, '');
const ORDERS_URL = BASE_ORDERS_URL.endsWith('/api') ? BASE_ORDERS_URL : `${BASE_ORDERS_URL}/api`;

const TOKEN_KEY = 'psp_token';

export class OrdersApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'OrdersApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('psp_access_token');

  const headers = { Accept: 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const fullUrl = path.startsWith('http') ? path : `${ORDERS_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  let response;
  try {
    response = await fetch(fullUrl, { ...options, headers });
  } catch {
    throw new OrdersApiError(0, 'No se pudo conectar con el servicio de pedidos. Verifica que Psp.Orders.services esté activo.');
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let msg = data?.error || data?.message || data?.detail;
    if (!msg && data?.errors && typeof data.errors === 'object') {
      const errList = Object.values(data.errors).flat();
      if (errList.length > 0) msg = errList.join(' ');
    }
    if (!msg) msg = data?.title || `Error ${response.status}`;
    throw new OrdersApiError(response.status, msg);
  }

  return data;
}

export const ordersApi = {
  // ---------- CARRITO ----------
  getCart: () => request('/cart'),

  addToCart: (productId, quantity = 1) =>
    request('/cart/items', { method: 'PUT', body: { productId, quantity } }),

  updateQuantity: (productId, quantity) =>
    request(`/cart/items/${productId}`, { method: 'PATCH', body: { quantity } }),

  removeFromCart: (productId) =>
    request(`/cart/items/${productId}`, { method: 'DELETE' }),

  clearCart: () => request('/cart', { method: 'DELETE' }),

  // ---------- CHECKOUT & COMPRAS (CLIENTE) ----------
  checkout: (payload) =>
    request('/orders/checkout', { method: 'POST', body: payload }),

  getMyOrders: ({ page = 1, pageSize = 10 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    return request(`/my/orders?${params.toString()}`);
  },

  getMyOrder: (orderId) => request(`/my/orders/${orderId}`),

  cancelMyOrder: (orderId) =>
    request(`/my/orders/${orderId}/cancel`, { method: 'POST' }),

  // ---------- PORTAL EMPRESA ALIADA (VENDEDOR) ----------
  getVendorOrders: ({ status = '', page = 1, pageSize = 15 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.set('status', status);
    return request(`/vendor/orders?${params.toString()}`);
  },

  getVendorOrder: (subOrderId) => request(`/vendor/orders/${subOrderId}`),

  updateVendorSubOrderStatus: (subOrderId, payload) =>
    request(`/vendor/orders/${subOrderId}/status`, { method: 'PATCH', body: payload }),

  // ---------- ADMINISTRACIÓN GLOBAL ----------
  getAdminOrders: ({ status = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.set('status', status);
    return request(`/admin/orders?${params.toString()}`);
  },
};

export default ordersApi;
