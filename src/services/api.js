// Central API Service Client for Render Backend (https://identity-hub-psp.onrender.com/api)

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://identity-hub-psp.onrender.com').replace(/\/$/, '');
export const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const TOKEN_KEY = 'psp_access_token';
const REFRESH_KEY = 'psp_refresh_token';
const USER_KEY = 'psp_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setSession = ({ access, refresh, user }, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  if (access) storage.setItem(TOKEN_KEY, access);
  if (refresh) storage.setItem(REFRESH_KEY, refresh);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.detail || data.message || data.error || `Error ${response.status}`;
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  } catch (error) {
    console.warn(`[API] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
};

// Authentication Services
export const authService = {
  login: async (usernameOrEmail, password, rememberMe = true) => {
    try {
      const data = await apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: usernameOrEmail,
          email: usernameOrEmail,
          password,
        }),
      });

      if (data.access || data.token) {
        setSession({
          access: data.access || data.token,
          refresh: data.refresh,
          user: data.user || data,
        }, rememberMe);
      }
      return data;
    } catch (err) {
      console.warn('Real login endpoint error, falling back or propagating:', err.message);
      throw err;
    }
  },

  register: async (userData) => {
    return await apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return await apiFetch('/auth/me/', { method: 'GET' });
  },

  updateProfile: async (profileData) => {
    return await apiFetch('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
};

// Products API Service Client for Render Backend (VITE_PRODUCTS_URL)
const PRODUCTS_BASE_URL = (import.meta.env.VITE_PRODUCTS_URL || 'https://products-psp.onrender.com').replace(/\/$/, '');
export const PRODUCTS_API_URL = PRODUCTS_BASE_URL.endsWith('/api') ? PRODUCTS_BASE_URL : `${PRODUCTS_BASE_URL}/api`;

export const productService = {
  getProducts: async () => {
    try {
      const response = await fetch(`${PRODUCTS_API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al consultar la API de productos`);
      }
      const data = await response.json();
      const rawItems = Array.isArray(data) ? data : (data.items || []);

      return rawItems.map((item) => ({
        id: item.id || item.sku,
        nombre: item.nombre || item.name || 'Producto sin nombre',
        categoria: item.categoria || 'Productos Locales',
        descripcion: item.descripcion || '',
        precio: typeof item.precio === 'number' ? item.precio : parseFloat(item.precio || 0),
        precioAnterior: item.precioAnterior ? parseFloat(item.precioAnterior) : null,
        imagen: item.imagen || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        proveedor: item.proveedor || item.municipio || 'Productor Local Urabá',
        municipio: item.municipio || 'Urabá, Colombia',
        destacado: Boolean(item.destacado),
        stock: item.stock || 10,
        rawItem: item,
      }));
    } catch (error) {
      console.warn('[Products API] Call to /products failed:', error.message);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${PRODUCTS_API_URL}/products/${id}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`[Products API] Call to /products/${id} failed:`, error.message);
      throw error;
    }
  },
};

