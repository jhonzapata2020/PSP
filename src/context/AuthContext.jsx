import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setSession, clearSession, getStoredUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStoredUser() || (() => {
      const saved = localStorage.getItem('psp_user');
      return saved ? JSON.parse(saved) : null;
    })();
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [showGeoBanner, setShowGeoBanner] = useState(() => {
    return localStorage.getItem('psp_hide_geo') !== 'true';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Try loading real user profile on mount if token exists
  useEffect(() => {
    const fetchUserOnMount = async () => {
      try {
        const realProfile = await authService.getProfile();
        if (realProfile) {
          const formatted = {
            id: realProfile.id || realProfile.pk || 'usr-101',
            name: realProfile.name || realProfile.full_name || realProfile.username || 'Usuario PSP',
            email: realProfile.email || 'usuario@psp.co',
            avatar: realProfile.profile_photo_url || realProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: realProfile.role || 'Aliado PSP',
            municipio: realProfile.municipio || 'Apartadó, Urabá',
            completedProfile: realProfile.profile_complete ?? true,
          };
          setUser(formatted);
          localStorage.setItem('psp_user', JSON.stringify(formatted));
        }
      } catch (e) {
        // Silently keep existing user state if offline or demo
      }
    };
    fetchUserOnMount();
  }, []);

  const login = async (userData, password = null) => {
    setIsLoadingAuth(true);
    try {
      if (typeof userData === 'string' && password) {
        // Real API login call to Render Backend
        const apiData = await authService.login(userData, password);
        const loggedUser = apiData.user || apiData;
        const newUser = {
          id: loggedUser.id || 'usr-101',
          name: loggedUser.name || loggedUser.full_name || loggedUser.username || userData.split('@')[0],
          email: loggedUser.email || userData,
          avatar: loggedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: loggedUser.role || 'Aliado PSP Urabá',
          municipio: loggedUser.municipio || 'Apartadó, Urabá',
          completedProfile: loggedUser.profile_complete ?? true,
        };
        setUser(newUser);
        localStorage.setItem('psp_user', JSON.stringify(newUser));
        setIsLoadingAuth(false);
        return newUser;
      } else {
        // Client / Demo login fallback
        const newUser = {
          id: userData.id || 'usr-101',
          name: userData.name || 'Jhon Zapata',
          email: userData.email || 'jhon.zapata@ejemplo.com',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: userData.role || 'Emprendedor Social',
          municipio: userData.municipio || 'Apartadó, Urabá',
          personType: userData.personType || 'natural',
          documentType: userData.documentType || 'CC',
          documentNumber: userData.documentNumber || '1017123456',
          completedProfile: userData.completedProfile ?? true,
        };
        setUser(newUser);
        localStorage.setItem('psp_user', JSON.stringify(newUser));
        setIsLoadingAuth(false);
        return newUser;
      }
    } catch (err) {
      setIsLoadingAuth(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    clearSession();
    localStorage.removeItem('psp_user');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('psp_user', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissGeoBanner = (permanent = false) => {
    setShowGeoBanner(false);
    if (permanent) {
      localStorage.setItem('psp_hide_geo', 'true');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      isLoadingAuth,
      showGeoBanner,
      dismissGeoBanner,
      showProfileModal,
      setShowProfileModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
