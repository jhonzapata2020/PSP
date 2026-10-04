import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * Ruta protegida por permiso RBAC.
 *
 * - Sin token            -> /ingresar
 * - Token pero sin permiso -> pantalla de "acceso denegado" (no redirige en bucle)
 * - Cargando el token     -> esqueleto
 *
 * Uso:
 *   <ProtectedRoute permission="users.write">...</ProtectedRoute>
 *   <ProtectedRoute permissions={['users.read', 'roles.read']}>...</ProtectedRoute>
 */
export default function ProtectedRoute({ permission, permissions, children }) {
  const { user, initializing, hasPermission } = useAuth();
  const location = useLocation();

  const required = permissions ?? (permission ? [permission] : []);

  if (initializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-psp-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No hay sesión -> volver al login conservando la ruta de origen.
  if (!user) {
    return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  }

  // Sesión válida pero sin los permisos requeridos.
  if (required.length > 0 && !required.some((code) => hasPermission(code))) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Acceso restringido
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Tu rol <strong className="text-psp-teal dark:text-psp-cyan">{user.role}</strong> no tiene
          el permiso <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">{required.join(' o ')}</code>.
          Solicita acceso a un administrador.
        </p>
        <a
          href="/mi-cuenta"
          className="mt-5 px-5 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold"
        >
          Volver a mi cuenta
        </a>
      </div>
    );
  }

  return children;
}
