import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('psp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showGeoBanner, setShowGeoBanner] = useState(() => {
    return localStorage.getItem('psp_hide_geo') !== 'true';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  const login = (userData) => {
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
  };

  const logout = () => {
    setUser(null);
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
