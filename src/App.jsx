import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import GeoConsentBanner from './components/common/GeoConsentBanner';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import CartDrawer from './components/common/CartDrawer';
import EcommerceFloatingButton from './components/common/EcommerceFloatingButton';

import HomePage from './pages/HomePage';
import MapaPage from './pages/MapaPage';
import EmpresasAliadasPage from './pages/EmpresasAliadasPage';
import ComercioPage from './pages/ComercioPage';
import ForoPage from './pages/ForoPage';
import AyudaPage from './pages/AyudaPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

// Panel de administración (Fase 3 - Gestor de Identidades)
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout, { AdminIndexRedirect } from './pages/admin/AdminLayout';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';
import AdminRolesPage from './pages/admin/AdminRolesPage';
import AdminMatrizPage from './pages/admin/AdminMatrizPage';
import AdminResumenPage from './pages/admin/AdminResumenPage';
import AdminAuditoriaPage from './pages/admin/AdminAuditoriaPage';

// Legal & Policy Pages (Etapa 1)
import TerminosCondicionesPage from './pages/TerminosCondicionesPage';
import PoliticaPrivacidadPage from './pages/PoliticaPrivacidadPage';
import PoliticaCookiesPage from './pages/PoliticaCookiesPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-psp-dark text-slate-900 dark:text-slate-100 selection:bg-psp-cyan/30 selection:text-psp-cyan overflow-x-hidden w-full max-w-full">
              <GeoConsentBanner />
              <Header />
              
              <main className="flex-grow w-full max-w-full overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/mapa" element={<MapaPage />} />
                  <Route path="/map" element={<MapaPage />} />
                  <Route path="/empresas-aliadas" element={<EmpresasAliadasPage />} />
                  <Route path="/comercio/*" element={<ComercioPage />} />
                  <Route path="/foro" element={<ForoPage />} />
                  <Route path="/ayuda" element={<AyudaPage />} />
                  <Route path="/ingresar" element={<AuthPage />} />
                  <Route path="/registro" element={<AuthPage />} />
                  <Route path="/mi-cuenta" element={<ProfilePage />} />
                  <Route path="/mi-perfil-publico" element={<ProfilePage />} />

                  {/* Fase 3: Gestor de Identidades (RBAC) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute permissions={['users.read', 'roles.read']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminIndexRedirect />} />
                    <Route
                      path="resumen"
                      element={
                        <ProtectedRoute permission="users.read">
                          <AdminResumenPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="usuarios"
                      element={
                        <ProtectedRoute permission="users.read">
                          <AdminUsuariosPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="roles"
                      element={
                        <ProtectedRoute permission="roles.read">
                          <AdminRolesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="matriz"
                      element={
                        <ProtectedRoute permission="roles.read">
                          <AdminMatrizPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="auditoria"
                      element={
                        <ProtectedRoute permission="audit.read">
                          <AdminAuditoriaPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Etapa 1 Legal Routes */}
                  <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
                  <Route path="/politica-de-privacidad" element={<PoliticaPrivacidadPage />} />
                  <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <EcommerceFloatingButton />
              <CartDrawer />
              <CookieConsentBanner />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
