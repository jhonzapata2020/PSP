import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  MessageSquare, 
  HelpCircle, 
  Sun, 
  Moon, 
  ShoppingBag, 
  Bell, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Mapa Interactivo', path: '/mapa' },
    { name: 'Empresas Aliadas', path: '/empresas-aliadas' },
    { name: 'Foro Social', path: '/foro' },
    { name: 'Ayuda & Transparencia', path: '/ayuda' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50 w-full">
      
      {/* TopBar / Micro-nav */}
      <div className="border-b border-slate-200 dark:border-[#203330]/70 bg-white/90 dark:bg-[#0e1514]/90 backdrop-blur-md text-xs py-2 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-slate-400 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-brand-emerald dark:text-teal-300 dark:border dark:border-teal-500/30 shrink-0">
              Región Urabá
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px] sm:text-xs truncate">
              Conectando 11 municipios al nodo logístico e industrial
            </span>
          </div>

          {/* Municipality quick tags */}
          <div className="hidden xl:flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-[11px] shrink-0">
            <span className="font-medium text-slate-400 dark:text-slate-500">Municipios sede:</span>
            <Link to="/comercio" className="cursor-pointer hover:text-brand-emerald dark:hover:text-teal-300 transition">Apartadó</Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/comercio" className="cursor-pointer hover:text-brand-emerald dark:hover:text-teal-300 transition">Turbo</Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/comercio" className="cursor-pointer hover:text-brand-emerald dark:hover:text-teal-300 transition">Necoclí</Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/comercio" className="cursor-pointer hover:text-brand-emerald dark:hover:text-teal-300 transition">Carepa</Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/comercio" className="cursor-pointer hover:text-brand-emerald dark:hover:text-teal-300 transition">Chigorodó</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-[#0e1514]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#203330] shadow-sm dark:shadow-lg dark:shadow-black/30 transition-all duration-200 w-full relative z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 w-full">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0c4236] dark:bg-gradient-to-br dark:from-teal-400 dark:to-emerald-600 flex items-center justify-center text-white dark:text-slate-950 font-black text-base sm:text-lg tracking-wider shadow-md shadow-[#0c4236]/20 dark:shadow-teal-500/20 group-hover:scale-105 transition">
              PSP
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-slate-100 font-extrabold tracking-tight text-xs sm:text-base leading-tight group-hover:text-brand-emerald dark:group-hover:text-teal-300 transition whitespace-nowrap">
                Plataforma Social
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase whitespace-nowrap">
                Con Propósito • Urabá
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Shown on XL screens (>=1280px) */}
          <div className="hidden xl:flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm font-extrabold whitespace-nowrap shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    active
                      ? 'text-[#0c4236] bg-emerald-100/80 dark:text-teal-300 dark:bg-teal-950/70 dark:border dark:border-teal-500/30 font-black'
                      : 'text-slate-700 hover:text-[#0c4236] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-teal-300 dark:hover:bg-[#182422]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              to="/registro"
              className="px-2.5 py-1.5 text-slate-700 hover:text-[#0c4236] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-teal-300 dark:hover:bg-[#182422] rounded-xl transition-all whitespace-nowrap font-bold"
            >
              Registrar Empresa
            </Link>
          </div>

          {/* Header Action Buttons (Cart, Profile, Hamburguer) - Always fully visible & anchored */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            
            {/* Theme Toggle (Visible on medium screens and up) */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex p-2 text-slate-600 dark:text-slate-400 hover:text-[#0c4236] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-[#182422] rounded-full transition border border-slate-200 dark:border-[#203330] shrink-0"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Notifications (Visible on medium screens and up) */}
            <div className="hidden sm:block shrink-0">
              <NotificationBell />
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-[#0c4236] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-[#182422] rounded-full transition border border-slate-200 dark:border-[#203330] shrink-0"
              title="Carrito de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 dark:bg-teal-400 text-white dark:text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account Profile Button - ALWAYS FULLY VISIBLE & NEVER CUT OFF */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl border border-slate-200 dark:border-[#203330] hover:bg-slate-100 dark:hover:bg-[#182422] transition-colors shrink-0"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#0c4236] dark:ring-teal-400 shrink-0"
                  />
                  <span className="hidden sm:inline-block text-xs font-extrabold text-slate-900 dark:text-white max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                {/* User Dropdown Menu - Positioned safely inside viewport */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 max-w-[calc(100vw-2rem)]"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#203330]">
                      <p className="text-xs text-slate-400">Sesión iniciada como</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-teal-300 bg-emerald-100 dark:bg-teal-950/70 rounded-md">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/mi-cuenta"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
                      >
                        <User className="w-4 h-4 text-[#0c4236] dark:text-teal-300" />
                        Mi Cuenta & Perfil
                      </Link>
                      <Link
                        to="/comercio"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
                      >
                        <Store className="w-4 h-4 text-[#0c4236] dark:text-teal-300" />
                        Mis Publicaciones
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-[#203330]">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/ingresar"
                className="inline-flex items-center gap-1.5 bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-md shadow-[#0c4236]/20 dark:shadow-teal-500/20 transition-all duration-200 whitespace-nowrap shrink-0 border border-[#0c4236]"
              >
                <User className="w-3.5 h-3.5 text-white dark:text-slate-950" />
                <span>Acceso</span>
              </Link>
            )}

            {/* Mobile / Tablet Hamburguer Menu Button - Shown on screens < xl (1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422] rounded-xl border border-slate-200 dark:border-[#203330] transition-colors shrink-0"
              title="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </nav>
      </header>

      {/* Mobile & Tablet Nav Drawer with Quick Controls */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#0e1514]/98 border-b border-slate-200 dark:border-[#203330] px-4 pt-4 pb-6 animate-in slide-in-from-top-3 shadow-2xl relative z-40">
          
          {/* Quick Utility Control Panel inside Mobile Drawer */}
          <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#182422] text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#203330] shadow-sm"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span>Modo Oscuro</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Notificaciones:</span>
              <NotificationBell />
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive(link.path)
                    ? 'bg-emerald-100 text-[#0c4236] dark:bg-teal-950/80 dark:text-teal-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/comercio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-100 text-[#0c4236] dark:bg-teal-950/80 dark:text-teal-300 flex items-center gap-2 font-bold"
            >
              <Store className="w-4 h-4" /> Comercio & Servicios (E-Commerce)
            </Link>
            <Link
              to="/registro"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
            >
              Registrar Empresa
            </Link>
          </nav>
        </div>
      )}

    </div>
  );
};

export default Header;
