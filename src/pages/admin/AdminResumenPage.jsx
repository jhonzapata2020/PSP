import React, { useCallback, useEffect, useState } from 'react';
import {
  Users, UserPlus, Activity, ShieldCheck, RefreshCw, Clock,
  ArrowRight, MapPin, Info,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/** Etiquetas legibles para los códigos de auditoría. */
export const ACTION_LABELS = {
  'user.create': 'Usuario creado',
  'user.update': 'Usuario editado',
  'user.delete': 'Usuario eliminado',
  'user.status': 'Cambio de estado',
  'user.roles': 'Roles reasignados',
  'role.create': 'Rol creado',
  'role.update': 'Rol editado',
  'role.delete': 'Rol eliminado',
  'role.permissions': 'Permisos modificados',
  'auth.login': 'Inicio de sesión',
  'auth.register': 'Registro',
  'profile.update': 'Perfil actualizado',
  'profile.password': 'Contraseña cambiada',
};

/** Color del chip según el grupo de acción. */
export const actionClass = (action) => {
  if (action?.startsWith('user.')) return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
  if (action?.startsWith('role.')) return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
  if (action?.startsWith('auth.')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

const relTime = (iso) => {
  if (!iso) return '—';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'hace unos segundos';
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  return `hace ${Math.floor(s / 86400)} d`;
};

const absTime = (iso) =>
  iso ? new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }) : '—';

/** Barra horizontal reutilizable para las gráficas del dashboard. */
function Bar({ label, value, max, tone = 'bg-psp-cyan' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">{label}</span>
        <span className="text-[11px] font-extrabold text-slate-900 dark:text-white shrink-0">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <Icon className={`w-4 h-4 shrink-0 ${tone}`} />
      </div>
      <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export default function AdminResumenPage() {
  const { hasPermission } = useAuth();
  const canAudit = hasPermission('audit.read');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStats(await api.stats());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const u = stats?.users;
  const r = stats?.roles;
  const a = stats?.activity;
  const maxRole = Math.max(0, ...(stats?.usersByRole ?? []).map((x) => x.count));
  const maxMun = Math.max(0, ...(stats?.usersByMunicipio ?? []).map((x) => x.count));

  const statusTotal = Math.max(1, (u?.active ?? 0) + (u?.inactive ?? 0) + (u?.blocked ?? 0));
  const pct = (n) => Math.round(((n ?? 0) / statusTotal) * 100);

  return (
    <div className="space-y-4">
      {/* ---------- Cabecera ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Resumen</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estado de la plataforma y actividad reciente
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

      {error && (
        <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      {loading && !stats ? (
        <p className="text-xs text-slate-400 py-10 text-center">Cargando estadísticas...</p>
      ) : stats ? (
        <>
          {/* ---------- KPIs ---------- */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <Kpi
              icon={Users}
              label="Usuarios"
              value={u?.total ?? 0}
              hint={`${u?.active ?? 0} activos`}
              tone="text-psp-teal dark:text-psp-cyan"
            />
            <Kpi
              icon={UserPlus}
              label="Nuevos (30 días)"
              value={u?.newLast30Days ?? 0}
              hint={`${u?.withCompletedProfile ?? 0} con perfil al 100%`}
              tone="text-emerald-500"
            />
            <Kpi
              icon={ShieldCheck}
              label="Roles / permisos"
              value={r?.total ?? 0}
              hint={`${r?.permissions ?? 0} permisos · ${r?.assignedUserCount ?? 0} asignaciones`}
              tone="text-violet-500"
            />
            <Kpi
              icon={Activity}
              label="Actividad 24 h"
              value={a?.auditLast24h ?? 0}
              hint={`${a?.activeLast24h ?? 0} accesos · ${a?.auditEntries ?? 0} eventos`}
              tone="text-sky-500"
            />
          </div>

          {/* ---------- Estado + gráficas ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Estado de las cuentas */}
            <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Estado de las cuentas
              </p>

              <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="bg-emerald-500" style={{ width: `${pct(u?.active)}%` }} title="Activo" />
                <div className="bg-slate-400" style={{ width: `${pct(u?.inactive)}%` }} title="Inactivo" />
                <div className="bg-rose-500" style={{ width: `${pct(u?.blocked)}%` }} title="Bloqueado" />
              </div>

              <ul className="mt-4 space-y-2.5">
                {[
                  { c: 'bg-emerald-500', l: 'Activos', v: u?.active },
                  { c: 'bg-slate-400', l: 'Inactivos', v: u?.inactive },
                  { c: 'bg-rose-500', l: 'Bloqueados', v: u?.blocked },
                ].map((row) => (
                  <li key={row.l} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.c}`} />
                      {row.l}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {row.v ?? 0}
                      <span className="ml-1.5 text-[10px] font-bold text-slate-400">{pct(row.v)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usuarios por rol */}
            <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Usuarios por rol
              </p>
              <div className="space-y-3">
                {(stats.usersByRole ?? []).map((x) => (
                  <Bar key={x.name} label={x.name} value={x.count} max={maxRole} />
                ))}
                {!stats.usersByRole?.length && (
                  <p className="text-xs text-slate-400">Sin datos.</p>
                )}
              </div>
            </div>

            {/* Municipios */}
            <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Top municipios
              </p>
              <div className="space-y-3">
                {(stats.usersByMunicipio ?? []).map((x) => (
                  <Bar key={x.name} label={x.name} value={x.count} max={maxMun} tone="bg-psp-teal" />
                ))}
                {!stats.usersByMunicipio?.length && (
                  <p className="text-xs text-slate-400">Aún nadie registró su municipio.</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------- Actividad reciente ---------- */}
          <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Actividad reciente
              </p>
              {canAudit && (
                <a
                  href="/admin/auditoria"
                  className="text-[11px] font-extrabold text-psp-teal dark:text-psp-cyan flex items-center gap-1 hover:underline"
                >
                  Ver auditoría completa <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentActivity?.length ? (
                stats.recentActivity.map((ev) => (
                  <li key={ev.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`mt-0.5 shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${actionClass(ev.action)}`}>
                      {ACTION_LABELS[ev.action] ?? ev.action}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">
                          {ev.actorName || ev.actorEmail || 'Sistema'}
                        </strong>
                        {ev.entityLabel && (
                          <span className="text-slate-500 dark:text-slate-400"> → {ev.entityLabel}</span>
                        )}
                      </p>
                      {ev.detail && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{ev.detail}</p>
                      )}
                    </div>
                    <span
                      className="shrink-0 text-[10px] text-slate-400"
                      title={absTime(ev.createdAt)}
                    >
                      {relTime(ev.createdAt)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-xs text-slate-400">
                  <Info className="w-4 h-4 inline -mt-0.5 mr-1" />
                  Todavía no hay movimientos registrados.
                </li>
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
