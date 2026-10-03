/**
 * Cliente HTTP para la API de productos (psp.products, ASP.NET Core 8).
 *
 * Mismo estilo que ./api.js: adjunta el JWT si hay sesión y normaliza
 * los errores al contrato { status, message } que ya pinta la UI.
 */

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL || 'http://localhost:5182';
const TOKEN_KEY = 'psp_token';

export class ProductsApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ProductsApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  const headers = { Accept: 'application/json', ...options.headers };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(`${PRODUCTS_URL}${path}`, { ...options, headers });
  } catch {
    throw new ProductsApiError(0, 'No se pudo conectar con la API de productos. ¿Está arrancada en el puerto 5182?');
  }

  const text = await response.text();
  let data = null;
  if (text) { try { data = JSON.parse(text); } catch { data = null; } }

  if (!response.ok) {
    let msg = data?.error || data?.message;
    if (!msg && data?.errors && typeof data.errors === 'object') {
      const errList = Object.values(data.errors).flat();
      if (errList.length > 0) msg = errList.join(' ');
    }
    if (!msg) msg = data?.title || `Error ${response.status}`;
    throw new ProductsApiError(response.status, msg);
  }

  return data;
}

export const productsApi = {

  // ── Lectura pública ──────────────────────────────────────────────────────

  /** Catálogo paginado con filtros. `q` usa FULLTEXT de MySQL. */
  list: ({ q = '', categoryCode = '', sort = '', page = 1, pageSize = 48 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (q) params.set('q', q);
    if (categoryCode) params.set('categoryCode', categoryCode);
    if (sort) params.set('sort', sort);
    return request(`/api/products?${params.toString()}`);
  },

  /** Sección destacada de la home. Soporta filtro por categoría. */
  featured: (limit = 4, categoryCode = '') => {
    const params = new URLSearchParams({ limit });
    if (categoryCode) params.set('categoryCode', categoryCode);
    return request(`/api/products/featured?${params.toString()}`);
  },

  /** Todas las categorías activas con su conteo de publicados. Soporta filtro por texto (?q=). */
  categories: (q = '') => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const queryString = params.toString();
    return request(`/api/categories${queryString ? `?${queryString}` : ''}`);
  },

  /** Ficha completa pública (imágenes, características, especificaciones). */
  get: (idOrSlug) => request(`/api/products/${encodeURIComponent(idOrSlug)}`),

  // ── Admin: lectura ───────────────────────────────────────────────────────

  /** Listado de administración con múltiples filtros y paginación. */
  adminList: ({ q = '', status = '', categoryCode = '', categoryId = '', municipality = '', minPrice = '', maxPrice = '', page = 1, pageSize = 24 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    if (categoryCode) params.set('categoryCode', categoryCode);
    if (categoryId) params.set('categoryId', categoryId);
    if (municipality) params.set('municipality', municipality);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    return request(`/api/admin/products?${params.toString()}`);
  },

  /** Ficha completa de admin (sin filtro de publicado). */
  adminGet: (idOrSku) => request(`/api/admin/products/${encodeURIComponent(idOrSku)}`),

  // ── Admin: escritura ─────────────────────────────────────────────────────

  create: (input) => request('/api/admin/products', { method: 'POST', body: input }),

  update: (idOrSku, input) =>
    request(`/api/admin/products/${encodeURIComponent(idOrSku)}`, { method: 'PUT', body: input }),

  setStatus: (idOrSku, estado) =>
    request(`/api/admin/products/${encodeURIComponent(idOrSku)}/status`, {
      method: 'POST', body: { estado },
    }),

  setBulkStatus: (skus, estado = 'published') =>
    request('/api/admin/products/bulk-status', {
      method: 'POST',
      body: { skus, estado },
    }),

  setFeatured: (idOrSku, destacado) =>
    request(`/api/admin/products/${encodeURIComponent(idOrSku)}/featured`, {
      method: 'PUT', body: { destacado },
    }),

  remove: (idOrSku) =>
    request(`/api/admin/products/${encodeURIComponent(idOrSku)}`, { method: 'DELETE' }),

  uploadImage: async (idOrSku, file, alt = '') => {
    const token = localStorage.getItem(TOKEN_KEY);
    const formData = new FormData();
    formData.append('file', file);
    const url = `${PRODUCTS_URL}/api/admin/products/${encodeURIComponent(idOrSku)}/images${alt ? `?alt=${encodeURIComponent(alt)}` : ''}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    let data; try { data = await response.json(); } catch { data = null; }
    if (!response.ok) throw new ProductsApiError(response.status, data?.error || 'Falló la subida de imagen');
    return data;
  },

  // ── Admin: carga masiva ──────────────────────────────────────────────────

  uploadBulkImages: async (file) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const formData = new FormData();
    formData.append('zipFile', file);
    const response = await fetch(`${PRODUCTS_URL}/api/admin/bulk/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    let data; try { data = await response.json(); } catch { data = null; }
    if (!response.ok) throw new ProductsApiError(response.status, data?.error || 'Falló la subida del archivo comprimido');
    return data;
  },

  uploadBulkProducts: async (file, batchSize = 25, autoApprove = true) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${PRODUCTS_URL}/api/admin/bulk/products?batchSize=${batchSize}&autoApprove=${autoApprove}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    let data; try { data = await response.json(); } catch { data = null; }
    if (!response.ok) throw new ProductsApiError(response.status, data?.error || 'Falló el procesamiento del archivo');
    return data;
  },

  uploadBulkCsv: async (file, autoApprove = true) => {
    // Redirige al nuevo método unificado de productos (soporta .xlsx, .xls y .csv)
    return productsApi.uploadBulkProducts(file, 25, autoApprove);
  },

  downloadBulkTemplate: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${PRODUCTS_URL}/api/admin/bulk/template`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new ProductsApiError(response.status, 'No se pudo descargar la plantilla');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos_psp.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default productsApi;
