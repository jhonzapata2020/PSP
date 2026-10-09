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
import ErrorBoundary from './components/common/ErrorBoundary';

import HomePage from './pages/HomePage';
import MapaPage from './pages/MapaPage';
import EmpresasAliadasPage from './pages/EmpresasAliadasPage';
import ComercioPage from './pages/ComercioPage';
import ForoPage from './pages/ForoPage';
import AyudaPage from './pages/AyudaPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import JovenesMas from './pages/aliados/JovenesMas';

// Portal de Comerciantes & Catálogo (Módulo Desacoplado)
import VendorLayout from './pages/comercio/VendorLayout';

// Panel de administración (Fase 3 - Gestor de Identidades)
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout, { AdminIndexRedirect } from './pages/admin/AdminLayout';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';
import AdminRolesPage from './pages/admin/AdminRolesPage';
import AdminMatrizPage from './pages/admin/AdminMatrizPage';
import AdminResumenPage from './pages/admin/AdminResumenPage';
import AdminAuditoriaPage from './pages/admin/AdminAuditoriaPage';
import AdminProductosPage from './pages/admin/AdminProductosPage';
import AdminCatalogoPage from './pages/admin/AdminCatalogoPage';
import ProductFormPage from './pages/admin/ProductFormPage';

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
                <ErrorBoundary>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ingresar" element={<AuthPage />} />
                    <Route path="/registro" element={<AuthPage />} />

                    {/* Gated Protected Services: Require Login */}
                    <Route path="/mapa" element={<ProtectedRoute><MapaPage /></ProtectedRoute>} />
                    <Route path="/map" element={<ProtectedRoute><MapaPage /></ProtectedRoute>} />
                    <Route path="/empresas-aliadas" element={<ProtectedRoute><EmpresasAliadasPage /></ProtectedRoute>} />
                    <Route path="/comercio/*" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/domicilios" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/domicilios-express" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/rappi" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/express" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/movilidad" element={<ProtectedRoute><ComercioPage /></ProtectedRoute>} />
                    <Route path="/foro" element={<ProtectedRoute><ForoPage /></ProtectedRoute>} />
                    <Route path="/ayuda" element={<ProtectedRoute><AyudaPage /></ProtectedRoute>} />
                    <Route path="/mi-cuenta" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/mi-perfil-publico" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/aliados/jovenes-mas" element={<ProtectedRoute><JovenesMas /></ProtectedRoute>} />


                    {/* Portal del Comerciante / Gestión de Catálogo (Módulo Independiente) */}
                    <Route
                      path="/mi-comercio"
                      element={
                        <ProtectedRoute permission="products.manage">
                          <VendorLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="catalogo" replace />} />
                      <Route path="catalogo" element={<AdminCatalogoPage />} />
                      <Route path="catalogo/nuevo" element={<ProductFormPage />} />
                      <Route path="catalogo/editar/:sku" element={<ProductFormPage />} />
                      <Route path="productos" element={<AdminProductosPage />} />
                    </Route>

                    {/* Fase 3: Gestor de Identidades (RBAC Admin Panel) */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute permissions={['users.read', 'roles.read', 'audit.read']}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminIndexRedirect />} />
                      <Route
                        path="resumen"
                        element={
                          <ProtectedRoute permission="roles.manage">
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
                      {/* Redirecciones de compatibilidad para URLs antiguas /admin/productos y /admin/catalogo */}
                      <Route path="productos" element={<Navigate to="/mi-comercio/productos" replace />} />
                      <Route path="catalogo" element={<Navigate to="/mi-comercio/catalogo" replace />} />
                      <Route path="catalogo/nuevo" element={<Navigate to="/mi-comercio/catalogo/nuevo" replace />} />
                      <Route path="catalogo/editar/:sku" element={<Navigate to="/mi-comercio/catalogo" replace />} />
                    </Route>

                  {/* Etapa 1 Legal Routes */}
                  <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
                  <Route path="/politica-de-privacidad" element={<PoliticaPrivacidadPage />} />
                  <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />


                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
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
