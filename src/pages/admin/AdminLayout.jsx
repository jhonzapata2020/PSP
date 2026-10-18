import React from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Grid3x3,
  LogOut,
  ExternalLink,
  Home,
  LayoutDashboard,
  History,
  Store,
  ShoppingBag,
  Building2,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const NAV = [
  { to: '/admin/resumen',   label: 'Resumen',           icon: LayoutDashboard, perm: 'roles.manage'    },
  { to: '/admin/metricas',  label: 'Métricas & Tráfico', icon: BarChart3,       perm: 'roles.manage'    },
  { to: '/admin/empresas',  label: 'Empresas Aliadas',  icon: Building2,       perm: 'users.read'      },
  { to: '/admin/pedidos',   label: 'Pedidos & Ventas',  icon: ShoppingBag,     perm: 'orders.manage'   },
  { to: '/admin/usuarios',  label: 'Usuarios',           icon: Users,           perm: 'users.read'      },
  { to: '/admin/roles',     label: 'Roles',              icon: ShieldCheck,     perm: 'roles.read'      },
  { to: '/admin/matriz',    label: 'Matriz de permisos', icon: Grid3x3,         perm: 'roles.read'      },
  { to: '/admin/auditoria', label: 'Auditoría',          icon: History,         perm: 'audit.read'      },
];

/**
 * Redirección de /admin -> primera sección permitida por el usuario.
 * (Evita mandar a un rol sin users.read a /admin/usuarios).
 */
export function AdminIndexRedirect() {
  const { hasPermission } = useAuth();
  const first = NAV.find((i) => hasPermission(i.perm)) ?? NAV[0];
  const to = first.to.replace('/admin/', '');
  return <Navigate to={to} replace />;
}

/**
 * Layout del panel de administración (/admin/*).
 * Cada entrada del menú sólo se pinta si el usuario tiene el permiso,
 * así un Moderador (users.read + roles.read) ve el panel pero sin acciones de edición.
 */
export default function AdminLayout() {
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    try {
      return localStorage.getItem('psp_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('psp_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const items = NAV.filter((i) => hasPermission(i.perm));

  const handleLogout = () => {
    logout();
    navigate('/ingresar');
  };

  return (
    <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4">
      <div
        className={`grid grid-cols-1 transition-all duration-300 gap-4 items-start ${
          isCollapsed ? 'lg:grid-cols-[72px_1fr]' : 'lg:grid-cols-[240px_1fr]'
        }`}
      >
        {/* ---------- Sidebar ---------- */}
        <aside
          className={`rounded-2xl bg-white dark:bg-[#182638] border border-slate-200 dark:border-slate-700/60 shadow-lg overflow-hidden lg:sticky lg:top-4 transition-all duration-300 ${
            isCollapsed ? 'w-full' : 'w-full'
          }`}
        >
          {/* Header del Sidebar con botón de colapso */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-[#0f1824] flex items-center justify-between">
            {!isCollapsed ? (
              <div className="min-w-0 pr-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-psp-teal dark:text-cyan-400 truncate">
                  Gestor de Identidades
                </p>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            ) : (
              <div className="w-full flex justify-center py-1">
                <span
                  title={user?.name || 'Administrador'}
                  className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-black text-cyan-400"
                >
                  {(user?.name || 'A').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar para pantalla completa'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors shrink-0"
              aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* Roles si no está colapsado */}
          {!isCollapsed && (
            <div className="px-3 py-2 bg-slate-50/50 dark:bg-[#0f1824]/60 border-b border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1">
              {(user?.roleDisplayNames?.length ? user.roleDisplayNames : [user?.role || 'Admin']).map((rol) => (
                <span
                  key={rol}
                  className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold border border-cyan-500/30"
                >
                  {rol}
                </span>
              ))}
            </div>
          )}

          {/* Menú de Navegación Principal */}
          <nav className="p-2 space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-xl text-xs font-bold transition-all',
                    isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Accesos rápidos inferiores */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
            <NavLink
              to="/mi-comercio/catalogo"
              title={isCollapsed ? 'Portal Comerciante' : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-xl text-xs font-bold text-emerald-600 dark:text-teal-400 hover:bg-emerald-500/10 transition-colors',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                ].join(' ')
              }
            >
              <Store className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Portal Comerciante</span>}
            </NavLink>

            <NavLink
              to="/mi-cuenta"
              title={isCollapsed ? 'Mi cuenta' : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                ].join(' ')
              }
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Mi cuenta</span>}
            </NavLink>

            <NavLink
              to="/"
              title={isCollapsed ? 'Volver al sitio' : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                ].join(' ')
              }
            >
              <Home className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Volver al sitio</span>}
            </NavLink>

            <button
              onClick={handleLogout}
              title={isCollapsed ? 'Cerrar sesión' : undefined}
              className={`w-full flex items-center rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* ---------- Contenido Principal ---------- */}
        <section className="min-w-0 w-full transition-all duration-300">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
