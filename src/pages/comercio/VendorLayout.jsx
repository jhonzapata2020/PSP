import React from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutList,
  PackagePlus,
  Package,
  Store,
  ExternalLink,
  Home,
  LogOut,
  ShoppingBag,
  Truck,
} from 'lucide-react';

const VENDOR_NAV = [
  { to: '/mi-comercio/pedidos',        label: 'Pedidos Recibidos',     icon: Truck },
  { to: '/mi-comercio/catalogo',       label: 'Catálogo de Productos', icon: LayoutList },
  { to: '/mi-comercio/catalogo/nuevo', label: 'Nuevo Producto',        icon: PackagePlus },
  { to: '/mi-comercio/productos',      label: 'Carga Masiva (CSV)',    icon: Package },
];

export default function VendorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/ingresar');
  };

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">

        {/* ---------- Sidebar Merchant Portal ---------- */}
        <aside className="rounded-3xl bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-teal-500/20 shadow-xl overflow-hidden lg:sticky lg:top-24">
          <div className="p-5 border-b border-slate-100 dark:border-[#203330] bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-[#0e1514] dark:to-[#182422]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-teal-300">
                  Portal Comerciante
                </p>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  Gestión de Mi Catálogo
                </p>
              </div>
            </div>

            <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {user?.companyName || user?.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-teal-950/80 text-emerald-900 dark:text-teal-300 text-[10px] font-bold border border-emerald-200 dark:border-teal-500/30">
              <ShoppingBag className="w-3 h-3 text-emerald-700 dark:text-teal-400" />
              <span>Vendedor Autorizado PSP</span>
            </div>
          </div>

          <nav className="p-3 space-y-1.5">
            {VENDOR_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/mi-comercio/catalogo'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#0c4236] text-white shadow-md shadow-[#0c4236]/20 dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-100 dark:border-[#203330] space-y-1">
            <NavLink
              to="/comercio"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
            >
              <Store className="w-4 h-4 text-emerald-600 dark:text-teal-400" /> Ver Tienda Pública
            </NavLink>
            <NavLink
              to="/mi-cuenta"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
            >
              <ExternalLink className="w-4 h-4" /> Mi Perfil de Cuenta
            </NavLink>
            <NavLink
              to="/"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182422]"
            >
              <Home className="w-4 h-4" /> Volver al Inicio
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ---------- Main Content Area ---------- */}
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
