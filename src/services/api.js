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
