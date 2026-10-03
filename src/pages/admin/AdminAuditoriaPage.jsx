import React, { useCallback, useEffect, useState } from 'react';
import {
  Search, RefreshCw, ChevronLeft, ChevronRight, History, ShieldAlert,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ACTION_LABELS, actionClass } from './AdminResumenPage';

/** Grupos filtrables. El backend interpreta el punto final como prefijo ("user."). */
const GROUPS = [
  { value: '', label: 'Todo el historial' },
  { value: 'user.', label: 'Usuarios' },
  { value: 'role.', label: 'Roles y permisos' },
  { value: 'auth.', label: 'Accesos y registros' },
  { value: 'profile.', label: 'Perfiles propios' },
];

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '—';

export default function AdminAuditoriaPage() {
  const { hasPermission } = useAuth();

  // audit.read es el permiso de esta sección; el guard de ruta ya lo exige,
  // pero lo mantenemos explícito por si se reutiliza el componente.
  const canRead = hasPermission('audit.read');

  const [group, setGroup] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);

  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 15 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.audit({ action: group, search, page, pageSize }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [group, search, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  // debounce del buscador
  const [term, setTerm] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(term); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [term]);

  if (!canRead) {
    return (
      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 p-8 text-center">
        <ShieldAlert className="w-6 h-6 mx-auto text-amber-500" />
        <p className="mt-3 text-xs font-bold text-slate-600 dark:text-slate-300">
          Necesitas el permiso <code>audit.read</code> para ver la auditoría.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ---------- Cabecera ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Auditoría</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quién cambió qué, y cuándo · {data.total} evento{data.total === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          title="Recargar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ---------- Filtros ---------- */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por actor, recurso o acción..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
          />
        </div>
        <select
          value={group}
          onChange={(e) => { setGroup(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
        >
          {GROUPS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>

      {error && (
        <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      {/* ---------- Tabla ---------- */}
      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="text-left font-extrabold px-4 py-3">Fecha</th>
                <th className="text-left font-extrabold px-4 py-3">Quién</th>
                <th className="text-left font-extrabold px-4 py-3">Acción</th>
                <th className="text-left font-extrabold px-4 py-3">Recurso</th>
                <th className="text-left font-extrabold px-4 py-3 hidden lg:table-cell">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Cargando...</td></tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    <History className="w-5 h-5 mx-auto mb-2 opacity-60" />
                    Sin eventos para este filtro.
                  </td>
                </tr>
              ) : (
                data.items.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {fmtDateTime(ev.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                        {ev.actorName || ev.actorEmail || 'Sistema'}
                      </p>
                      {ev.actorEmail && ev.actorName && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{ev.actorEmail}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${actionClass(ev.action)}`}>
                        {ACTION_LABELS[ev.action] ?? ev.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <p className="truncate max-w-[200px]">{ev.entityLabel || '—'}</p>
                      <p className="text-[10px] text-slate-400">
                        {ev.entityType}
                        {ev.entityId != null ? ` #${ev.entityId}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden lg:table-cell max-w-[360px]">
                      {ev.detail || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-500">Página {data.page} de {totalPages}</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
