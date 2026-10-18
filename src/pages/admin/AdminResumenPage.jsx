import React, { useCallback, useEffect, useState } from 'react';
import {
  Users, UserPlus, Activity, ShieldCheck, RefreshCw, Clock,
  ArrowRight, MapPin, Info, LayoutDashboard, Maximize2, Minimize2, Smartphone,
  Sun, Moon
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AuditorioPresenterTools from '../../components/common/AuditorioPresenterTools';

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
export const actionClass = (action, isDark = true) => {
  if (action?.startsWith('user.')) return isDark ? 'bg-sky-950/80 text-sky-400 border-sky-500/30' : 'bg-sky-50 text-sky-700 border-sky-200';
  if (action?.startsWith('role.')) return isDark ? 'bg-purple-950/80 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200';
  if (action?.startsWith('auth.')) return isDark ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200';
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
function Bar({ label, value, max, tone = 'bg-cyan-500', isDark = true }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-[11px] font-bold truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
        <span className={`text-[11px] font-black shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden border ${isDark ? 'bg-[#0b131e] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, hint, tone = 'text-cyan-400', isDark = true, cardBg }) {
  return (
    <div className={`rounded-lg ${cardBg} p-3.5 flex flex-col justify-between h-24 hover:border-slate-500/40 transition-all`}>
      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${isDark ? 'bg-[#0f1824] border-slate-700/60' : 'bg-slate-100 border-slate-200'}`}>
          <Icon className={`w-3.5 h-3.5 ${tone}`} />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <p className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        {hint && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border truncate max-w-[130px] ${
            isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminResumenPage() {
  const { hasPermission } = useAuth();
  const canAudit = hasPermission('audit.read');

  // Control de Tema Exclusivo e Independiente del Dashboard (No altera el sidebar ni la barra superior)
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem('psp_resumen_dashboard_theme') || 'dark';
  });
  const isDark = dashboardTheme === 'dark';

  const toggleDashboardTheme = () => {
    setDashboardTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('psp_resumen_dashboard_theme', next);
      return next;
    });
  };

  // Modo Oscuro: Azul marino y pizarra ejecutivos (#111c2a / #182638 / #0f1824) - NUNCA negro carbón.
  // Modo Claro: Blanco grisáceo suave (#eef2f6 / #f8fafc / #edf2f7) - NUNCA blanco plano ni contrastes duros.
  const bgMain = isDark ? 'bg-[#111c2a]' : 'bg-[#eef2f6]';
  const cardBg = isDark
    ? 'bg-[#182638] border border-slate-700/60 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)]'
    : 'bg-[#f8fafc] border border-slate-300/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)]';
  const innerBg = isDark ? 'bg-[#0f1824]' : 'bg-[#edf2f7]';
  const titleColor = isDark ? 'text-white' : 'text-slate-800';
  const mutedColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-slate-300/80';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modo Pantalla Completa / Presentación (Kiosk Mode)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

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
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? `fixed inset-0 z-[9999] ${bgMain} overflow-y-auto p-3 sm:p-6 space-y-3 font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'} select-none w-screen h-screen relative`
          : `-m-3 sm:-m-6 p-3 sm:p-5 ${bgMain} min-h-[calc(100vh-80px)] space-y-3 select-none font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'} relative`
      }
    >
      {/* HERRAMIENTAS DE AUDITORIO: PUNTERO LÁSER Y LÁPIZ TIPO TEAMS / POWERPOINT */}
      <AuditorioPresenterTools
        containerRef={containerRef}
        isDark={isDark}
        isFullscreen={isFullscreen}
      />
      {/* 1. BANNER SUPERIOR CON ESTADO EN VIVO Y PANTALLA COMPLETA */}
      <div className={`rounded-lg ${cardBg} p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-600'} border flex items-center justify-center shrink-0`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`text-base sm:text-lg font-black ${titleColor} tracking-tight`}>
                Resumen Ejecutivo de la Plataforma
              </h1>
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isDark ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800'} border text-[10px] font-bold`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Sistema Operativo</span>
              </span>
            </div>
            <p className={`text-[11px] ${mutedColor}`}>
              Estado de identidades, roles, actividad institucional y municipios en Urabá
            </p>
          </div>
        </div>

        {/* Acciones del banner: Switch Tema, Pantalla Completa & Recargar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* BOTÓN DISCRETO TEMA CLARO / OSCURO (ESTILO PINTEREST) */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${borderColor} ${innerBg} shadow-inner`}>
            <button
              type="button"
              onClick={toggleDashboardTheme}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
              style={{ backgroundColor: isDark ? '#1e293b' : '#cbd5e1' }}
              title={isDark ? 'Cambiar a tema Blanco Gris' : 'Cambiar a tema Azul Pizarra'}
              aria-label="Alternar tema del panel"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                  isDark ? 'translate-x-6 bg-slate-900 text-amber-400' : 'translate-x-1 text-amber-500'
                }`}
              >
                {isDark ? <Moon className="w-3 h-3 text-cyan-300" /> : <Sun className="w-3 h-3 text-amber-500" />}
              </span>
            </button>
            <span className={`text-[10px] font-bold ${mutedColor} pr-1`}>
              {isDark ? 'Oscuro' : 'Claro'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all ${
              isFullscreen
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                : isDark
                ? 'bg-[#0f1824] hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/40'
                : 'bg-[#edf2f7] hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir a pantalla completa'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Salir Pantalla Completa</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Pantalla Completa</span>
              </>
            )}
          </button>

          <button
            onClick={load}
            disabled={loading}
            className={`p-1.5 rounded ${innerBg} border ${borderColor} ${mutedColor} hover:${titleColor} transition-all disabled:opacity-50`}
            title="Recargar estadísticas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <p className={`text-[11px] font-bold ${isDark ? 'text-rose-400 bg-rose-950/50 border-rose-500/30' : 'text-rose-700 bg-rose-100 border-rose-300'} border p-2.5 rounded-lg`}>
          {error}
        </p>
      )}

      {loading && !stats ? (
        <div className={`rounded-lg ${cardBg} p-10 text-center ${mutedColor} text-xs`}>
          Cargando estadísticas del sistema...
        </div>
      ) : stats ? (
        <>
          {/* 2. FILA DE 4 TARJETAS KPIS SUPERIORES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <Kpi
              icon={Users}
              label="Usuarios Registrados"
              value={u?.total ?? 0}
              hint={`${u?.active ?? 0} activos`}
              tone={isDark ? "text-cyan-400" : "text-blue-600"}
              isDark={isDark}
              cardBg={cardBg}
            />
            <Kpi
              icon={UserPlus}
              label="Nuevos (Últimos 30 días)"
              value={u?.newLast30Days ?? 0}
              hint={`${u?.withCompletedProfile ?? 0} perfil 100%`}
              tone={isDark ? "text-emerald-400" : "text-emerald-600"}
              isDark={isDark}
              cardBg={cardBg}
            />
            <Kpi
              icon={ShieldCheck}
              label="Roles & Permisos"
              value={r?.total ?? 0}
              hint={`${r?.permissions ?? 0} permisos`}
              tone={isDark ? "text-purple-400" : "text-purple-600"}
              isDark={isDark}
              cardBg={cardBg}
            />
            <Kpi
              icon={Activity}
              label="Actividad en 24 Horas"
              value={a?.auditLast24h ?? 0}
              hint={`${a?.auditEntries ?? 0} eventos`}
              tone={isDark ? "text-amber-400" : "text-amber-600"}
              isDark={isDark}
              cardBg={cardBg}
            />
          </div>

          {/* 3. FILA MEDIA: ESTADO DE CUENTAS + ROLES + MUNICIPIOS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            
            {/* Estado de las cuentas */}
            <div className={`rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-wider ${mutedColor} mb-3`}>
                  Estado de las Cuentas
                </p>

                <div className={`flex h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#0b131e] border-slate-800' : 'bg-slate-100 border-slate-200'} border`}>
                  <div className="bg-emerald-500" style={{ width: `${pct(u?.active)}%` }} title="Activo" />
                  <div className="bg-slate-400" style={{ width: `${pct(u?.inactive)}%` }} title="Inactivo" />
                  <div className="bg-rose-500" style={{ width: `${pct(u?.blocked)}%` }} title="Bloqueado" />
                </div>

                <ul className="mt-4 space-y-2">
                  {[
                    { c: 'bg-emerald-500', l: 'Activos', v: u?.active },
                    { c: 'bg-slate-400', l: 'Inactivos', v: u?.inactive },
                    { c: 'bg-rose-500', l: 'Bloqueados', v: u?.blocked },
                  ].map((row) => (
                    <li key={row.l} className={`flex items-center justify-between text-xs p-1.5 rounded ${innerBg} border ${borderColor}`}>
                      <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${row.c}`} />
                        {row.l}
                      </span>
                      <span className={`font-black ${titleColor}`}>
                        {row.v ?? 0}
                        <span className={`ml-1.5 text-[10px] font-bold ${mutedColor}`}>({pct(row.v)}%)</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-2 border-t ${borderColor} text-[10px] ${mutedColor} mt-3`}>
                Gestión de identidades centralizada en Urabá.
              </div>
            </div>

            {/* Usuarios por rol */}
            <div className={`rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-wider ${mutedColor} mb-3`}>
                  Distribución por Rol
                </p>
                <div className="space-y-3">
                  {(stats.usersByRole ?? []).map((x) => (
                    <Bar key={x.name} label={x.name} value={x.count} max={maxRole} tone="bg-cyan-500" isDark={isDark} />
                  ))}
                  {!stats.usersByRole?.length && (
                    <p className={`text-xs ${mutedColor}`}>Sin datos registrados.</p>
                  )}
                </div>
              </div>

              <div className={`pt-2 border-t ${borderColor} text-[10px] ${mutedColor} mt-3`}>
                Estructura de accesos y permisos RBAC.
              </div>
            </div>

            {/* Top Municipios */}
            <div className={`rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-wider ${mutedColor} mb-3 flex items-center gap-1`}>
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Municipios con Mayor Registro
                </p>
                <div className="space-y-3">
                  {(stats.usersByMunicipio ?? []).map((x) => (
                    <Bar key={x.name} label={x.name} value={x.count} max={maxMun} tone="bg-emerald-500" isDark={isDark} />
                  ))}
                  {!stats.usersByMunicipio?.length && (
                    <p className={`text-xs ${mutedColor}`}>Aún no hay municipios registrados.</p>
                  )}
                </div>
              </div>

              <div className={`pt-2 border-t ${borderColor} text-[10px] ${mutedColor} mt-3`}>
                Liderazgo de registros en Turbo y Apartadó.
              </div>
            </div>

          </div>

          {/* 4. FILA INFERIOR: ACTIVIDAD RECIENTE (AUDITORÍA INSTITUCIONAL) */}
          <div className={`rounded-lg ${cardBg} overflow-hidden`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${borderColor} ${innerBg}`}>
              <p className={`text-xs font-black uppercase tracking-wider ${titleColor} flex items-center gap-1.5`}>
                <Clock className="w-3.5 h-3.5 text-cyan-500" /> Registro de Actividad & Auditoría Reciente
              </p>
              {canAudit && (
                <a
                  href="/admin/auditoria"
                  className={`text-[11px] font-bold ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} flex items-center gap-1 hover:underline transition-colors`}
                >
                  Ver auditoría completa <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <ul className={`divide-y ${isDark ? 'divide-slate-800/80 bg-[#0f1824]/40' : 'divide-slate-200 bg-[#f8fafc]'}`}>
              {stats.recentActivity?.length ? (
                stats.recentActivity.map((ev) => (
                  <li key={ev.id} className={`px-4 py-2.5 flex items-center justify-between gap-3 ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-100/70'} transition-colors text-xs`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${actionClass(ev.action, isDark)}`}>
                        {ACTION_LABELS[ev.action] ?? ev.action}
                      </span>
                      <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} truncate`}>
                        <strong className={titleColor}>
                          {ev.actorName || ev.actorEmail || 'Sistema'}
                        </strong>
                        {ev.entityLabel && (
                          <span className={mutedColor}> → {ev.entityLabel}</span>
                        )}
                        {ev.detail && (
                          <span className={`${mutedColor} ml-1.5 text-[11px]`}>({ev.detail})</span>
                        )}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] ${mutedColor} font-mono`}
                      title={absTime(ev.createdAt)}
                    >
                      {relTime(ev.createdAt)}
                    </span>
                  </li>
                ))
              ) : (
                <li className={`px-4 py-8 text-center text-xs ${mutedColor}`}>
                  <Info className="w-4 h-4 inline -mt-0.5 mr-1" />
                  Todavía no hay movimientos registrados en la plataforma.
                </li>
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
