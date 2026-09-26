import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'psp_user';

/**
 * Convierte el UserProfileDto del backend al shape que ya usan
 * Header, ProfilePage y ForoPage (user.role, user.avatar, user.name...).
 */
function mapUser(dto) {
  if (!dto) return null;
  const roleDisplay = dto.roleDisplayNames?.length
    ? dto.roleDisplayNames
    : (dto.roles ?? []);

  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    avatar: dto.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
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
        const dto = await api.me();
        if (!cancelled) persist(mapUser(dto));
      } catch {
        // 401/403 o API caída: limpia la sesión local.
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
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.login(email, password);
        setToken(res.token);
        const mapped = mapUser(res.user);
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

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.register(payload);
        setToken(res.token);
        const mapped = mapUser(res.user);
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

  /** Edita el perfil propio vía PUT /api/auth/profile. */
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
        const mapped = mapUser(dto);
        persist(mapped);
        return mapped;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, persist]
  );

  /** Cambia la contraseña propia. */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    try {
      await api.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /** ¿Tiene el usuario el permiso RBAC? ("users.read", "roles.manage", ...) */
  const hasPermission = useCallback(
    (code) => Boolean(user?.permissions?.includes(code)),
    [user]
  );

  /** ¿Tiene el usuario el rol dado? ("admin", "moderador", ...) */
  const hasRole = useCallback(
    (roleName) => Boolean(user?.roles?.includes(roleName)),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      initializing,
      error,
      setError,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      hasPermission,
      hasRole,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, initializing, error, login, register, logout, updateProfile, changePassword, hasPermission, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
