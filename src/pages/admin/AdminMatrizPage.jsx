import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Grid3x3, Save, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Matriz RBAC: filas = permisos (agrupados), columnas = roles.
 * Cada celda es un checkbox; al marcarlo se recalcula la lista de permisos
 * del rol y se envía con PUT /api/roles/{id}/permissions.
 */
export default function AdminMatrizPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('roles.manage');

  const [matrix, setMatrix] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingCell, setSavingCell] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [m, r] = await Promise.all([api.permissionMatrix(), api.roles()]);
      setMatrix(m);
      setRoles(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const groups = useMemo(() => {
    const map = new Map();
    matrix.forEach((p) => {
      const key = p.group || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return [...map.entries()];
  }, [matrix]);

  const has = (perm, roleId) => (perm.roleIds ?? []).includes(roleId);

  const toggle = async (perm, role) => {
    if (!canManage) return;
    setSavingCell(`${perm.id}:${role.id}`);
    setError('');
    setNotice('');

    const current = roles.find((r) => r.id === role.id);
    const owned = current?.permissions ?? [];
    const wasOwned = owned.includes(perm.code);

    // Lista resultante de códigos del rol tras el toggle.
    const next = wasOwned
      ? owned.filter((c) => c !== perm.code)
      : [...owned, perm.code];

    const ids = matrix.filter((p) => next.includes(p.code)).map((p) => p.id);

    try {
      await api.assignRolePermissions(role.id, ids);
      // refresco local sin recargar toda la página
      setRoles((rs) => rs.map((r) => (r.id === role.id ? { ...r, permissions: next } : r)));
      setMatrix((ms) =>
        ms.map((p) =>
          p.id === perm.id
            ? {
                ...p,
                roleIds: wasOwned
                  ? p.roleIds.filter((x) => x !== role.id)
                  : [...p.roleIds, role.id],
              }
            : p
        )
      );
      setNotice(`${wasOwned ? 'Revocado' : 'Otorgado'} "${perm.code}" ${wasOwned ? 'de' : 'a'} "${role.displayName}".`);
    } catch (err) {
      setError(err.message);
      await load();
    } finally {
      setSavingCell(null);
    }
  };

  const totals = useMemo(() => {
    const t = {};
    roles.forEach((r) => { t[r.id] = matrix.filter((p) => has(p, r.id)).length; });
    return t;
  }, [matrix, roles]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-psp-teal dark:text-psp-cyan" />
            Matriz de permisos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {matrix.length} permisos × {roles.length} roles
            {!canManage && ' · sólo lectura (requiere roles.manage)'}
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

      {notice && (
        <p className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> {notice}
        </p>
      )}
      {error && (
        <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">{error}</p>
      )}

      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60">
                <th className="text-left font-extrabold px-4 py-3 text-[10px] uppercase tracking-wider text-slate-500 min-w-[260px] sticky left-0 bg-slate-50 dark:bg-slate-900/60 z-10">
                  Permiso
                </th>
                {roles.map((r) => (
                  <th key={r.id} className="px-3 py-3 text-center align-bottom min-w-[110px]">
                    <span className="block text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      {r.displayName}
                    </span>
                    <span className="block text-[9px] font-bold text-slate-400 mt-0.5">
                      {totals[r.id] ?? 0} permisos
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={roles.length + 1} className="px-4 py-10 text-center text-slate-400">
                    Cargando matriz...
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={roles.length + 1} className="px-4 py-10 text-center text-slate-400">
                    Sin permisos.
                  </td>
                </tr>
              ) : (
                groups.map(([group, list]) => (
                  <React.Fragment key={group}>
                    <tr>
                      <td
                        colSpan={roles.length + 1}
                        className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/50 text-[10px] font-extrabold uppercase tracking-widest text-psp-teal dark:text-psp-cyan sticky left-0"
                      >
                        {group}
                      </td>
                    </tr>
                    {list.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="px-4 py-2.5 sticky left-0 bg-white dark:bg-psp-dark-card z-10 border-r border-slate-100 dark:border-slate-800">
                          <span className="block font-mono font-bold text-slate-700 dark:text-slate-200 text-[11px]">{p.code}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">{p.description}</span>
                        </td>
                        {roles.map((r) => {
                          const on = has(p, r.id);
                          const busy = savingCell === `${p.id}:${r.id}`;
                          return (
                            <td key={r.id} className="px-3 py-2.5 text-center">
                              <button
                                onClick={() => toggle(p, r)}
                                disabled={!canManage || Boolean(savingCell)}
                                aria-pressed={on}
                                title={canManage ? `${on ? 'Revocar' : 'Otorgar'} ${p.code} → ${r.displayName}` : 'Requiere roles.manage'}
                                className={[
                                  'w-6 h-6 rounded-md border inline-flex items-center justify-center transition-colors',
                                  on
                                    ? 'bg-psp-cyan border-psp-cyan text-slate-950'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-psp-cyan',
                                  canManage ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
                                  busy ? 'animate-pulse' : '',
                                ].join(' ')}
                              >
                                {busy ? (
                                  <span className="w-3 h-3 border border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : on ? (
                                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : null}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <Save className="w-3.5 h-3.5" />
          Cada cambio se aplica inmediatamente con <code className="px-1 rounded bg-slate-100 dark:bg-slate-800">PUT /api/roles/&#123;id&#125;/permissions</code>
        </div>
      </div>
    </div>
  );
}
