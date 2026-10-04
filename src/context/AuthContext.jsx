import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getToken, setToken } from '../services/api';
import { loadAvatarDefaults } from '../services/avatarDefaults';

const AuthContext = createContext(null);

const USER_KEY = 'psp_user';

/**
 * Convierte el UserProfileDto del backend al shape que ya usan
 * Header, ProfilePage y ForoPage (user.role, user.avatar, user.name...).
 */
function mapUser(dto, fallbackAvatar = '') {
  if (!dto) return null;
  const roleDisplay = dto.roleDisplayNames?.length
    ? dto.roleDisplayNames
    : (dto.roles ?? []);

  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    avatar: dto.avatar || fallbackAvatar || '',
    municipio: dto.municipio ?? 'Apartadó, Urabá',
    personType: dto.personType ?? 'natural',
    documentType: dto.documentType ?? 'CC',
    documentNumber: dto.documentNumber ?? '',
    gender: dto.gender ?? null,
    phone: dto.phone ?? null,
    completedProfile: dto.completedProfile ?? 0,
    status: dto.status ?? 'active',

    /** Rol visible en el UI (etiqueta). */
    role: roleDisplay[0] ?? 'Miembro',

    /** RBAC crudo: nombres técnicos y códigos de permiso. */
    roles: dto.roles ?? [],
    roleDisplayNames: roleDisplay,
    permissions: dto.permissions ?? [],
  };
}

function readStoredUser() {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(() => Boolean(getToken()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showGeoBanner, setShowGeoBanner] = useState(() => {
    return localStorage.getItem('psp_hide_geo') !== 'true';
  });

  const dismissGeoBanner = useCallback(() => {
    localStorage.setItem('psp_hide_geo', 'true');
    setShowGeoBanner(false);
  }, []);

  /**
   * Fotos de fábrica (R2).
   */
  const [avatarDefaults, setAvatarDefaults] = useState([]);

  useEffect(() => {
    let cancelled = false;
    loadAvatarDefaults().then((list) => {
      if (!cancelled) setAvatarDefaults(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  }, []);

  /** Revalida el token guardado contra /api/auth/me al montar la app. */
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!getToken()) {
        setInitializing(false);
        return;
      }
      try {
        const [dto, defaults] = await Promise.all([api.me(), loadAvatarDefaults()]);
        if (!cancelled) {
          setAvatarDefaults(defaults);
          persist(mapUser(dto, defaults[0]));
        }
      } catch {
        if (!cancelled) {
          setToken(null);
          persist(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const login = useCallback(
    async (emailOrData, password) => {
      setLoading(true);
      setError(null);
      try {
        // Direct credentials login
        if (typeof emailOrData === 'string' && password) {
          const [res, defaults] = await Promise.all([
            api.login(emailOrData, password),
            loadAvatarDefaults(),
          ]);
          setToken(res.token);
          setAvatarDefaults(defaults);
          const mapped = mapUser(res.user, defaults[0]);
          persist(mapped);
          return mapped;
        } else if (typeof emailOrData === 'object') {
          // Client object login
          const mapped = {
            id: emailOrData.id || 'usr-101',
            name: emailOrData.name || 'Jhon Zapata',
            email: emailOrData.email || 'jhon.zapata@ejemplo.com',
            avatar: emailOrData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: emailOrData.role || 'Emprendedor Social',
            roles: ['admin'],
            permissions: ['users.read', 'roles.read', 'products.manage'],
            municipio: emailOrData.municipio || 'Apartadó, Urabá',
            completedProfile: emailOrData.completedProfile ?? 1,
          };
          persist(mapped);
          return mapped;
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const [res, defaults] = await Promise.all([
          api.register(payload),
          loadAvatarDefaults(),
        ]);
        setToken(res.token);
        setAvatarDefaults(defaults);
        const mapped = mapUser(res.user, defaults[0]);
        persist(mapped);
        return mapped;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    persist(null);
    setError(null);
  }, [persist]);

  const updateProfile = useCallback(
    async (fields) => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const dto = await api.updateProfile({
          name: fields.name ?? user.name,
          municipio: fields.municipio ?? user.municipio,
          avatar: fields.avatar ?? user.avatar,
          phone: fields.phone ?? user.phone,
          gender: fields.gender ?? user.gender,
        });
        const mapped = mapUser(dto, (await loadAvatarDefaults())[0]);
        persist(mapped);
        return mapped;
      } catch (err) {
        // Local fallback update
        const updated = { ...user, ...fields };
        persist(updated);
        return updated;
      } finally {
        setLoading(false);
      }
    },
    [user, persist]
  );

  const uploadAvatar = useCallback(
    async (file) => {
      setLoading(true);
      setError(null);
      try {
        const dto = await api.uploadAvatar(file);
        const mapped = mapUser(dto, (await loadAvatarDefaults())[0]);
        persist(mapped);
        return mapped;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    try {
      await api.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const hasPermission = useCallback(
    (code) => Boolean(user?.permissions?.includes(code) || user?.roles?.includes('admin')),
    [user]
  );

  const hasRole = useCallback(
    (roleName) => Boolean(user?.roles?.includes(roleName)),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoadingAuth: loading,
      initializing,
      error,
      setError,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      avatarDefaults,
      changePassword,
      hasPermission,
      hasRole,
      isAuthenticated: Boolean(user),
      showGeoBanner,
      dismissGeoBanner,
      showProfileModal,
      setShowProfileModal,
    }),
    [user, loading, initializing, error, login, register, logout, updateProfile, uploadAvatar, avatarDefaults, changePassword, hasPermission, hasRole, showGeoBanner, dismissGeoBanner, showProfileModal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
