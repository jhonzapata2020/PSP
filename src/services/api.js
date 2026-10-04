/**
 * Cliente HTTP para la API Identity Hub.
 * - Adjunta el JWT en cada petición autenticada.
 * - Normaliza los errores a { status, message } para pintarlos en la UI.
 */

const BASE_API_URL = (import.meta.env.VITE_API_URL || 'https://identity-hub-psp.onrender.com').replace(/\/$/, '');
const API_URL = BASE_API_URL.endsWith('/api') ? BASE_API_URL : `${BASE_API_URL}/api`;

const TOKEN_KEY = 'psp_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem('psp_access_token');
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('psp_access_token', token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('psp_access_token');
  }
};

export const clearSession = () => {
  setToken(null);
  localStorage.removeItem('psp_user');
  sessionStorage.clear();
};

export const getStoredUser = () => {
  try {
    const data = localStorage.getItem('psp_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/** Error controlado con status HTTP y mensaje legible. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, formData, auth = true } = {}) {
  const headers = { Accept: 'application/json' };

  if (formData === undefined && body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  const fullUrl = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  try {
    response = await fetch(fullUrl, {
      method,
      headers,
      body: formData !== undefined ? formData : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que la API esté activa.');
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
    const message =
      data?.error ||
      data?.message ||
      data?.detail ||
      (data?.title
        ? Object.entries(data.errors || {})
            .map(([field, msgs]) => `${field}: ${[].concat(msgs).join(', ')}`)
            .join(' | ') || data.title
        : null) ||
      `Error ${response.status}`;

    if (response.status === 401 && auth) {
      setToken(null);
      localStorage.removeItem('psp_user');
    }

    throw new ApiError(response.status, message);
  }

  return data;
}

export const api = {
  // ---------- AUTH ----------
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload, auth: false }),

  me: () => request('/auth/me'),

  myPermissions: () => request('/auth/permissions'),

  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PUT', body: payload }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),

  // ---------- AVATARES ----------
  avatarDefaults: () => request('/auth/avatar/defaults', { auth: false }),

  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('file', file, file.name || 'avatar');
    return request('/auth/avatar', { method: 'POST', formData: form });
  },

  // ---------- USERS ----------
  users: ({ q = '', status = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    return request(`/users?${params.toString()}`);
  },

  user: (id) => request(`/users/${id}`),

  createUser: (payload) => request('/users', { method: 'POST', body: payload }),

  updateUser: (id, payload) =>
    request(`/users/${id}`, { method: 'PUT', body: payload }),

  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  assignUserRoles: (id, roleIds) =>
    request(`/users/${id}/roles`, { method: 'PUT', body: { roleIds } }),

  changeUserStatus: (id, status) =>
    request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify(status) }),

  // ---------- ROLES / PERMISSIONS ----------
  roles: () => request('/roles'),

  createRole: (payload) => request('/roles', { method: 'POST', body: payload }),

  updateRole: (id, payload) => request(`/roles/${id}`, { method: 'PUT', body: payload }),

  deleteRole: (id) => request(`/roles/${id}`, { method: 'DELETE' }),

  assignRolePermissions: (id, permissionIds) =>
    request(`/roles/${id}/permissions`, { method: 'PUT', body: { permissionIds } }),

  permissions: () => request('/permissions'),

  permissionMatrix: () => request('/permissions/matrix'),

  // ---------- STATS / AUDIT ----------
  stats: () => request('/stats'),

  audit: ({ action = '', entityType = '', search = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (action) params.set('action', action);
    if (entityType) params.set('entityType', entityType);
    if (search) params.set('search', search);
    return request(`/audit?${params.toString()}`);
  },
};

export const authService = {
  login: (email, password) => api.login(email, password),
  register: (payload) => api.register(payload),
  getProfile: () => api.me(),
  updateProfile: (payload) => api.updateProfile(payload),
};

export default api;
