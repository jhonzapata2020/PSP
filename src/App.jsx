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
import EmpresasAliadasPage from './pages/EmpresasAliadasPage';
import ComercioPage from './pages/ComercioPage';
import ForoPage from './pages/ForoPage';
import AyudaPage from './pages/AyudaPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

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
                  <Route path="/empresas-aliadas" element={<EmpresasAliadasPage />} />
                  <Route path="/comercio/*" element={<ComercioPage />} />
                  <Route path="/foro" element={<ForoPage />} />
                  <Route path="/ayuda" element={<AyudaPage />} />
                  <Route path="/ingresar" element={<AuthPage />} />
                  <Route path="/registro" element={<AuthPage />} />
                  <Route path="/mi-cuenta" element={<ProfilePage />} />
                  <Route path="/mi-perfil-publico" element={<ProfilePage />} />

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
