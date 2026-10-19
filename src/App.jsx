import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import GeoConsentBanner from './components/common/GeoConsentBanner';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import CartDrawer from './components/common/CartDrawer';
import EcommerceFloatingButton from './components/common/EcommerceFloatingButton';
import ErrorBoundary from './components/common/ErrorBoundary';

// Landing principal cargada estáticamente para FCP instantáneo
import HomePage from './pages/HomePage';

// Lazy loading de páginas secundarias para aligerar el bundle inicial
const MapaPage = lazy(() => import('./pages/MapaPage'));
const EmpresasAliadasPage = lazy(() => import('./pages/EmpresasAliadasPage'));
const ComercioPage = lazy(() => import('./pages/ComercioPage'));
const ForoPage = lazy(() => import('./pages/ForoPage'));
const AyudaPage = lazy(() => import('./pages/AyudaPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const JovenesMas = lazy(() => import('./pages/aliados/JovenesMas'));
const LeidyMarulanda = lazy(() => import('./pages/aliados/LeidyMarulanda'));

// Portal de Comerciantes & Catálogo
const VendorLayout = lazy(() => import('./pages/comercio/VendorLayout'));
const CheckoutPage = lazy(() => import('./pages/comercio/CheckoutPage'));
const MisPedidosPage = lazy(() => import('./pages/comercio/MisPedidosPage'));
const VendorOrdersPage = lazy(() => import('./pages/comercio/VendorOrdersPage'));

// Panel de administración
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout, { AdminIndexRedirect } from './pages/admin/AdminLayout';
const AdminUsuariosPage = lazy(() => import('./pages/admin/AdminUsuariosPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'));
const AdminMatrizPage = lazy(() => import('./pages/admin/AdminMatrizPage'));
const AdminResumenPage = lazy(() => import('./pages/admin/AdminResumenPage'));
const AdminAuditoriaPage = lazy(() => import('./pages/admin/AdminAuditoriaPage'));
const AdminPedidosPage = lazy(() => import('./pages/admin/AdminPedidosPage'));
const AdminProductosPage = lazy(() => import('./pages/admin/AdminProductosPage'));
const AdminCatalogoPage = lazy(() => import('./pages/admin/AdminCatalogoPage'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const AdminEmpresasPage = lazy(() => import('./pages/admin/AdminEmpresasPage'));

// Legal & Policy Pages
const TerminosCondicionesPage = lazy(() => import('./pages/TerminosCondicionesPage'));
const PoliticaPrivacidadPage = lazy(() => import('./pages/PoliticaPrivacidadPage'));
const PoliticaCookiesPage = lazy(() => import('./pages/PoliticaCookiesPage'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="animate-spin h-9 w-9 border-4 border-psp-cyan border-t-transparent rounded-full" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cargando vista...</span>
    </div>
  );
}

function AdminEditRedirect() {
  const { sku } = useParams();
  return <Navigate to={`/mi-comercio/catalogo/editar/${sku}`} replace />;
}

function CarritoRedirect() {
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    setIsCartOpen(true);
    navigate('/comercio?tab=productos', { replace: true });
  }, [setIsCartOpen, navigate]);
  return null;
}

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
                  <Suspense fallback={<PageLoader />}>
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
                    {/* Vitrina pública en vivo para Domicilios Urabá (bloquea en el momento de pagar/despachar si no tiene membresía) */}
                    <Route path="/domicilios" element={<ComercioPage />} />
                    <Route path="/domicilios-express" element={<ComercioPage />} />
                    <Route path="/rappi" element={<ComercioPage />} />
                    <Route path="/express" element={<ComercioPage />} />
                    <Route path="/movilidad" element={<ComercioPage />} />
                    <Route path="/foro" element={<ProtectedRoute><ForoPage /></ProtectedRoute>} />
                    <Route path="/ayuda" element={<ProtectedRoute><AyudaPage /></ProtectedRoute>} />
                    <Route path="/mi-cuenta" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/mi-perfil-publico" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/mis-pedidos" element={<ProtectedRoute><MisPedidosPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/carrito" element={<CarritoRedirect />} />
                    <Route path="/cart" element={<CarritoRedirect />} />
                    <Route path="/aliados/jovenes-mas" element={<ProtectedRoute><JovenesMas /></ProtectedRoute>} />
                    <Route path="/aliados/leidy-marulanda" element={<ProtectedRoute><LeidyMarulanda /></ProtectedRoute>} />


                    {/* Portal del Comerciante / Gestión de Catálogo y Pedidos (Módulo Independiente) */}
                    <Route
                      path="/mi-comercio"
                      element={
                        <ProtectedRoute permission="products.manage">
                          <VendorLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="pedidos" replace />} />
                      <Route path="pedidos" element={<VendorOrdersPage />} />
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
                        path="empresas"
                        element={
                          <ProtectedRoute permission="users.read">
                            <AdminEmpresasPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="resumen"
                        element={
                          <ProtectedRoute permission="roles.manage">
                            <AdminResumenPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="pedidos"
                        element={
                          <ProtectedRoute permission="orders.manage">
                            <AdminPedidosPage />
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
                      <Route path="catalogo/editar/:sku" element={<AdminEditRedirect />} />
                    </Route>

                  {/* Etapa 1 Legal Routes */}
                  <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
                  <Route path="/politica-de-privacidad" element={<PoliticaPrivacidadPage />} />
                  <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />


                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
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
