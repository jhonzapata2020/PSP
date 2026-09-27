/**
 * Cliente HTTP para la API Identity Hub (ASP.NET Core 8).
 * - Adjunta el JWT en cada petición autenticada.
 * - Normaliza los errores a { status, message } para pintarlos en la UI.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5081';

const TOKEN_KEY = 'psp_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

/** Error controlado con status HTTP y mensaje legible. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que la API esté activa.');
  }

  // 204 No Content
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
    // El backend devuelve { error: "mensaje" } vía DomainExceptionMiddleware,
    // o el formato ProblemDetails de la validación automática de [ApiController].
    const message =
      data?.error ||
      (data?.title
        ? Object.entries(data.errors || {})
            .map(([field, msgs]) => `${field}: ${[].concat(msgs).join(', ')}`)
            .join(' | ') || data.title
        : null) ||
      `Error ${response.status}`;

    if (response.status === 401 && auth) {
      // Token expirado o inválido: cerrar sesión silenciosamente.
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
    request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: payload, auth: false }),

  me: () => request('/api/auth/me'),

  myPermissions: () => request('/api/auth/permissions'),

  updateProfile: (payload) =>
    request('/api/auth/profile', { method: 'PUT', body: payload }),

  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),

  // ---------- USERS (requiere permisos users.*) ----------
  users: ({ q = '', status = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    return request(`/api/users?${params.toString()}`);
  },

  user: (id) => request(`/api/users/${id}`),

  createUser: (payload) => request('/api/users', { method: 'POST', body: payload }),

  updateUser: (id, payload) =>
    request(`/api/users/${id}`, { method: 'PUT', body: payload }),

  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),

  assignUserRoles: (id, roleIds) =>
    request(`/api/users/${id}/roles`, { method: 'PUT', body: { roleIds } }),

  changeUserStatus: (id, status) =>
    // El backend recibe [FromBody] string → body JSON plano: "active" | "inactive" | "blocked"
    request(`/api/users/${id}/status`, { method: 'PATCH', body: JSON.stringify(status) }),

  // ---------- ROLES / PERMISSIONS ----------
  roles: () => request('/api/roles'),

  createRole: (payload) => request('/api/roles', { method: 'POST', body: payload }),

  updateRole: (id, payload) => request(`/api/roles/${id}`, { method: 'PUT', body: payload }),

  deleteRole: (id) => request(`/api/roles/${id}`, { method: 'DELETE' }),

  assignRolePermissions: (id, permissionIds) =>
    request(`/api/roles/${id}/permissions`, { method: 'PUT', body: { permissionIds } }),

  permissions: () => request('/api/permissions'),

  permissionMatrix: () => request('/api/permissions/matrix'),

  // ---------- STATS / AUDIT (Fase 4) ----------
  /** Agregados del dashboard: totales por estado, por rol y actividad reciente. */
  stats: () => request('/api/stats'),

  /** Historial de auditoría paginado. `action` acepta prefijo: "user." agrupa. */
  audit: ({ action = '', entityType = '', search = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (action) params.set('action', action);
    if (entityType) params.set('entityType', entityType);
    if (search) params.set('search', search);
    return request(`/api/audit?${params.toString()}`);
  },
};

export default api;
