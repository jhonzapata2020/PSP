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
  Package,
  LayoutList,
} from 'lucide-react';

const NAV = [
  { to: '/admin/resumen',   label: 'Resumen',           icon: LayoutDashboard, perm: 'users.read'      },
  { to: '/admin/usuarios',  label: 'Usuarios',           icon: Users,           perm: 'users.read'      },
  { to: '/admin/roles',     label: 'Roles',              icon: ShieldCheck,     perm: 'roles.read'      },
  { to: '/admin/matriz',    label: 'Matriz de permisos', icon: Grid3x3,         perm: 'roles.read'      },
  { to: '/admin/auditoria', label: 'Auditoría',          icon: History,         perm: 'audit.read'      },
  { to: '/admin/catalogo',  label: 'Catálogo',           icon: LayoutList,      perm: 'products.manage' },
  { to: '/admin/productos', label: 'Carga Masiva',       icon: Package,         perm: 'products.manage' },
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

  const items = NAV.filter((i) => hasPermission(i.perm));

  const handleLogout = () => {
    logout();
    navigate('/ingresar');
  };

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">

        {/* ---------- Sidebar ---------- */}
        <aside className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft overflow-hidden lg:sticky lg:top-6">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-psp-teal dark:text-psp-cyan">
              Gestor de Identidades
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {(user?.roleDisplayNames?.length ? user.roleDisplayNames : [user?.role]).map((rol) => (
                <span
                  key={rol}
                  className="px-2 py-0.5 rounded-full bg-psp-cyan/15 text-psp-teal dark:text-psp-cyan text-[10px] font-bold border border-psp-cyan/30"
                >
                  {rol}
                </span>
              ))}
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-psp-cyan text-slate-950'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <NavLink
              to="/mi-cuenta"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4" /> Mi cuenta
            </NavLink>
            <NavLink
              to="/"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Home className="w-4 h-4" /> Volver al sitio
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ---------- Contenido ---------- */}
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
