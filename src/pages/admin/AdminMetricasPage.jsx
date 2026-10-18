import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Search,
  Users,
  ChevronDown,
  Building2,
  MapPin,
  Star,
  Filter,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Activity,
  Navigation,
  Globe2,
  Target,
  Megaphone,
  CheckCircle2,
  Sliders,
  Zap,
  Award,
  Maximize2,
  Minimize2,
  Smartphone,
  MoveHorizontal,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuditorioPresenterTools from '../../components/common/AuditorioPresenterTools';

const EVENTOS_VIVO = [
  { tiempo: 'Hace 8s', ciudad: 'Apartadó', detalle: 'Consulta directa a catálogo de emprendimiento agrícola', tag: 'Interacción' },
  { tiempo: 'Hace 24s', ciudad: 'Turbo', detalle: 'Usuario exploró comercios del sector puerto y gastronomía', tag: 'Visita' },
  { tiempo: 'Hace 42s', ciudad: 'Carepa', detalle: 'Nuevo usuario conectado desde dispositivo móvil', tag: 'Tráfico' },
  { tiempo: 'Hace 1m', ciudad: 'Chigorodó', detalle: 'Enlace de la plataforma compartido por WhatsApp', tag: 'Difusión' },
  { tiempo: 'Hace 2m', ciudad: 'Apartadó', detalle: 'Consulta a perfil de Fundación Jóvenes+', tag: 'Impacto' },
];

export default function AdminMetricasPage() {
  const { user } = useAuth();

  // Control de Tema Exclusivo e Independiente del Dashboard (No altera el sidebar ni la barra superior)
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem('psp_metricas_dashboard_theme') || 'dark';
  });
  const isDark = dashboardTheme === 'dark';

  const toggleDashboardTheme = () => {
    setDashboardTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('psp_metricas_dashboard_theme', next);
      return next;
    });
  };

  const [liveUsers, setLiveUsers] = useState(5);
  const [mapaFiltro, setMapaFiltro] = useState('uraba'); // 'uraba' | 'antioquia' | 'nacional'
  const [hoveredNodo, setHoveredNodo] = useState(null);

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

  // Estado para la reunión: Asesor y Simulador de Marketing
  const [presupuestoMkt, setPresupuestoMkt] = useState(600000); // 300.000, 600.000, 1.200.000 COP
  const [eventoActualIndex, setEventoActualIndex] = useState(0);

  // Fluctuación en vivo realista (3 a 7 personas conectadas)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const val = prev + delta;
        return val < 3 ? 4 : val > 7 ? 5 : val;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Ticker de eventos en vivo para reuniones
  useEffect(() => {
    const evTimer = setInterval(() => {
      setEventoActualIndex((prev) => (prev + 1) % EVENTOS_VIVO.length);
    }, 6000);
    return () => clearInterval(evTimer);
  }, []);

  // Clases dinámicas del Dashboard:
  // Modo Oscuro: Azul marino y pizarra ejecutivos (#111c2a / #182638 / #0f1824) - NUNCA negro carbón.
  // Modo Claro: Blanco grisáceo suave (#eef2f6 / #f8fafc / #edf2f7) - NUNCA blanco plano ni contrastes duros.
  const bgMain = isDark
    ? 'bg-[#111c2a] text-slate-100'
    : 'bg-[#eef2f6] text-slate-800';
  const cardBg = isDark
    ? 'bg-[#182638] border border-slate-700/60 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)]'
    : 'bg-[#f8fafc] border border-slate-300/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)]';
  const innerBg = isDark
    ? 'bg-[#0f1824] border border-slate-800 text-slate-300'
    : 'bg-[#edf2f7] border border-slate-200 text-slate-700';
  const titleColor = isDark ? 'text-white' : 'text-slate-800';
  const mutedColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-slate-300/80';

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? `fixed inset-0 z-[9999] overflow-y-auto p-3 sm:p-6 space-y-3 font-sans select-none w-screen h-screen ${bgMain} relative`
          : `-m-3 sm:-m-6 p-3 sm:p-5 min-h-[calc(100vh-80px)] space-y-3 select-none font-sans ${bgMain} relative`
      }
    >
      {/* HERRAMIENTAS DE AUDITORIO: PUNTERO LÁSER Y LÁPIZ TIPO TEAMS / POWERPOINT */}
      <AuditorioPresenterTools
        containerRef={containerRef}
        isDark={isDark}
        isFullscreen={isFullscreen}
      />
      
      {/* 1. BANNER SUPERIOR CON TITILACIÓN VERDE SUAVE, SWITCH DE TEMA Y PANTALLA COMPLETA */}
      <div className={`rounded-lg ${cardBg} p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className={`text-base sm:text-lg font-black tracking-tight ${titleColor} shrink-0 whitespace-nowrap`}>
                Panel de Control & Métricas de Impacto
              </h1>
              {/* BOTONCITO VERDE TITILANDO BLINDADO (NUNCA SE PARTE EN 2 RENGLONES) */}
              <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="whitespace-nowrap">{liveUsers} en vivo</span>
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className={`text-[11px] ${mutedColor} shrink-0`}>
                Seguimiento de visitas, aliados y adopción comunitaria en Urabá y Antioquia
              </p>

              {/* TICKER DE ACTIVIDAD EN VIVO EN CÁPSULA ESTABLE DE 1 SOLO RENGLÓN (NUNCA DEFORMA EL TÍTULO) */}
              <div className={`hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] ${innerBg} border ${borderColor} shrink-0 max-w-[420px] overflow-hidden whitespace-nowrap shadow-sm`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className={`text-[10px] ${mutedColor} shrink-0 font-medium`}>{EVENTOS_VIVO[eventoActualIndex].tiempo}:</span>
                <span className={`font-bold ${titleColor} shrink-0`}>{EVENTOS_VIVO[eventoActualIndex].ciudad}</span>
                <span className={`text-[10px] ${mutedColor} truncate`}>— {EVENTOS_VIVO[eventoActualIndex].detalle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros rápidos, Switch Discreto de Tema & Botón Pantalla Completa */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* SWITCH DISCRETO DE TEMA CLARO / OSCURO (PINTEREST STYLE) */}
          <button
            type="button"
            onClick={toggleDashboardTheme}
            className={`relative flex items-center h-7 w-14 px-1 rounded-full transition-all duration-300 focus:outline-none border shadow-inner shrink-0 ${
              isDark
                ? 'bg-[#0f1824] border-slate-700/80 hover:border-slate-600'
                : 'bg-slate-200 border-slate-300 hover:border-slate-400'
            }`}
            title={isDark ? 'Cambiar a tema Blanco Gris' : 'Cambiar a tema Azul Pizarra'}
            aria-label="Alternar tema del panel"
          >
            <span className="w-full flex justify-between items-center text-[10px] pointer-events-none px-0.5">
              <Sun className={`w-3 h-3 transition-opacity duration-300 ${!isDark ? 'opacity-0' : 'text-amber-400/80'}`} />
              <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'text-slate-500'}`} />
            </span>
            <span
              className={`absolute top-0.5 bottom-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-md transform ${
                isDark
                  ? 'left-[calc(100%-26px)] bg-cyan-500 text-slate-950'
                  : 'left-0.5 bg-white text-amber-500'
              }`}
            >
              {isDark ? (
                <Moon className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Sun className="w-3.5 h-3.5 fill-current" />
              )}
            </span>
          </button>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${innerBg}`}>
            <Calendar className={`w-3 h-3 ${mutedColor}`} />
            <span>12 Oct 2026 - 19 Oct 2026</span>
          </div>

          {/* BOTÓN PANTALLA COMPLETA (EXPANDIR PANEL A TODA LA PANTALLA) */}
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
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir panel a pantalla completa'}
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
            type="button"
            className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <Download className="w-3 h-3" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* AVISO INTELIGENTE EN CELULARES (ESTÁNDAR TOP PLATFORMS: GOOGLE ANALYTICS / DATADOG) */}
      <div className={`sm:hidden p-2.5 rounded-lg ${cardBg} flex items-center justify-between gap-2 shadow-sm`}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 shrink-0">
            <Smartphone className="w-4 h-4 animate-bounce" />
          </span>
          <p className={`text-[11px] ${mutedColor} leading-tight`}>
            <strong className={titleColor}>Tip Celular:</strong> Gira tu teléfono en horizontal o desliza con el dedo hacia los lados.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="px-2 py-1 rounded bg-cyan-500 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1"
        >
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{isFullscreen ? 'Normal' : 'Expandir'}</span>
        </button>
      </div>

      {/* 2. FILA DE 4 TARJETAS KPIS SUPERIORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* KPI 1 */}
        <div className={`rounded-lg ${cardBg} p-3.5 flex flex-col justify-between h-24 hover:border-cyan-500/40 transition-all`}>
          <p className={`text-[11px] font-medium ${mutedColor}`}>
            Visitas Acumuladas
          </p>
          <div className="flex items-baseline justify-between">
            <p className={`text-2xl font-black ${titleColor} tracking-tight`}>
              184
            </p>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
              +12% semana
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`rounded-lg ${cardBg} p-3.5 flex flex-col justify-between h-24 hover:border-cyan-500/40 transition-all`}>
          <p className={`text-[11px] font-medium ${mutedColor}`}>
            Nuevas Conexiones
          </p>
          <div className="flex items-baseline justify-between">
            <p className={`text-2xl font-black ${titleColor} tracking-tight`}>
              38
            </p>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
              +8% boca a boca
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`rounded-lg ${cardBg} p-3.5 flex flex-col justify-between h-24 hover:border-cyan-500/40 transition-all`}>
          <p className={`text-[11px] font-medium ${mutedColor}`}>
            Tasa de Crecimiento
          </p>
          <div className="flex items-baseline justify-between">
            <p className={`text-2xl font-black ${titleColor} tracking-tight`}>
              15.4%
            </p>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ Activo
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`rounded-lg ${cardBg} p-3.5 flex flex-col justify-between h-24 hover:border-cyan-500/40 transition-all`}>
          <p className={`text-[11px] font-medium ${mutedColor}`}>
            Aceptación Comunitaria
          </p>
          <div className="flex items-baseline justify-between">
            <p className={`text-2xl font-black ${titleColor} tracking-tight`}>
              4.9
            </p>
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. FILA MEDIA: RESUMEN DE VISITAS + PARTICIPACIÓN POR MUNICIPIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        
        {/* GRÁFICO COMBINADO: BARRAS + LÍNEA AZUL FLUIDA (7 COLS) */}
        <div className={`lg:col-span-7 rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
          <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
            <h3 className={`text-xs font-black ${titleColor} uppercase tracking-wider`}>
              Resumen de Visitas & Adopción
            </h3>
            <div className="flex items-center gap-2">
              <span className={`sm:hidden text-[9px] ${isDark ? 'text-cyan-400 bg-[#0f1824] border-cyan-500/30' : 'text-blue-600 bg-blue-50 border-blue-200'} font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border`}>
                <MoveHorizontal className="w-3 h-3" /> Desliza
              </span>
              <span className={`text-[10px] font-bold ${mutedColor} ${innerBg} px-2 py-0.5 rounded`}>
                Lunes a Domingo
              </span>
            </div>
          </div>

          <div className="overflow-x-auto touch-pan-x scrollbar-thin pb-1">
            <div className="min-w-[420px] sm:min-w-0 relative w-full h-44 sm:h-48 my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 450 160" preserveAspectRatio="none">
              <line x1="25" y1="30" x2="435" y2="30" stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" opacity="0.6" />
              <line x1="25" y1="70" x2="435" y2="70" stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" opacity="0.6" />
              <line x1="25" y1="110" x2="435" y2="110" stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" opacity="0.6" />

              <text x="5" y="34" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="8" fontWeight="bold">50</text>
              <text x="5" y="74" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="8" fontWeight="bold">30</text>
              <text x="5" y="114" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="8" fontWeight="bold">15</text>

              {/* BARRAS AZULES */}
              <rect x="52" y="105" width="16" height="35" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="52" y="120" width="16" height="20" rx="3" fill="#3b82f6" />
              
              <rect x="112" y="90" width="16" height="50" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="112" y="110" width="16" height="30" rx="3" fill="#3b82f6" />

              <rect x="172" y="75" width="16" height="65" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="172" y="100" width="16" height="40" rx="3" fill="#3b82f6" />

              <rect x="232" y="95" width="16" height="45" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="232" y="115" width="16" height="25" rx="3" fill="#3b82f6" />

              <rect x="292" y="60" width="16" height="80" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="292" y="90" width="16" height="50" rx="3" fill="#3b82f6" />

              <rect x="352" y="40" width="16" height="100" rx="3" fill="#2563eb" />
              <rect x="352" y="75" width="16" height="65" rx="3" fill="#60a5fa" />

              <rect x="412" y="50" width="16" height="90" rx="3" fill="#1e40af" opacity="0.8" />
              <rect x="412" y="85" width="16" height="55" rx="3" fill="#3b82f6" />

              {/* LÍNEA CONECTOR FLUIDA */}
              <path
                d="M 60 110 C 90 100, 100 85, 120 85 C 150 85, 160 70, 180 70 C 210 70, 220 90, 240 90 C 270 90, 280 50, 300 50 C 330 50, 340 35, 360 35 C 390 35, 400 45, 420 45"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <circle cx="60" cy="110" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <circle cx="120" cy="85" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <circle cx="180" cy="70" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <circle cx="240" cy="90" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <circle cx="300" cy="50" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <circle cx="360" cy="35" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
              <circle cx="420" cy="45" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />

              <text x="56" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Lun</text>
              <text x="116" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Mar</text>
              <text x="176" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Mié</text>
              <text x="236" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Jue</text>
              <text x="296" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Vie</text>
              <text x="356" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Sáb</text>
              <text x="416" y="154" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" fontWeight="bold">Dom</text>
            </svg>
            </div>
          </div>

          <div className={`pt-2 border-t ${borderColor} flex justify-between items-center text-xs`}>
            <span className={mutedColor}>
              Total Visitas Semana: <strong className={titleColor}>184</strong>
            </span>
            <span className={mutedColor}>
              Consultas a Comercios: <strong className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>94 acciones</strong>
            </span>
          </div>
        </div>

        {/* DONA CIRCULAR DE PARTICIPACIÓN TERRITORIAL (5 COLS) */}
        <div className={`lg:col-span-5 rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
          <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
            <h3 className={`text-xs font-black ${titleColor} uppercase tracking-wider`}>
              Distribución Territorial
            </h3>
            <span className={`text-[10px] font-bold ${mutedColor} ${innerBg} px-2 py-0.5 rounded`}>
              Urabá ⌄
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-2">
            
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" fill="none" stroke="#2563eb" strokeWidth="14" strokeDasharray="226" strokeDashoffset="153" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="226" strokeDashoffset="162" transform="rotate(115 50 50)" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="226" strokeDashoffset="169" transform="rotate(215 50 50)" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#ef4444" strokeWidth="14" strokeDasharray="226" strokeDashoffset="192" transform="rotate(305 50 50)" />
              </svg>

              <div className="text-center">
                <p className={`text-base font-black ${titleColor} leading-tight`}>85%</p>
                <p className={`text-[8px] ${mutedColor} font-bold uppercase`}>Urabá</p>
              </div>
            </div>

            <div className="space-y-1.5 w-full text-xs">
              <div className={`flex items-center justify-between ${mutedColor}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Apartadó
                </span>
                <span className={`font-bold ${titleColor}`}>32%</span>
              </div>
              <div className={`flex items-center justify-between ${mutedColor}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Turbo
                </span>
                <span className={`font-bold ${titleColor}`}>28%</span>
              </div>
              <div className={`flex items-center justify-between ${mutedColor}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Carepa
                </span>
                <span className={`font-bold ${titleColor}`}>25%</span>
              </div>
              <div className={`flex items-center justify-between ${mutedColor}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-red-500" /> Chigorodó / Otros
                </span>
                <span className={`font-bold ${titleColor}`}>15%</span>
              </div>
            </div>
          </div>

          <div className={`pt-2 border-t ${borderColor} text-[10px] ${mutedColor}`}>
            Fuerte adopción en el eje central de Apartadó y zona costera de Turbo.
          </div>
        </div>

      </div>

      {/* 4. FILA DE COMERCIOS Y TRÁFICO/CONVERSIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        
        {/* CARD IZQUIERDA: TOP COMERCIOS (5 COLS) */}
        <div className={`lg:col-span-5 rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
          <div>
            <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
              <h3 className={`text-xs font-black ${titleColor} uppercase tracking-wider`}>
                Comercios Aliados Más Consultados
              </h3>
              <ArrowUpRight className={`w-3.5 h-3.5 ${mutedColor}`} />
            </div>

            <div className="mt-3 space-y-2">
              <div className={`p-2 rounded ${innerBg} border ${borderColor} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs font-bold ${titleColor}`}>1. Snacks de Plátano Criollo</p>
                  <p className={`text-[10px] ${mutedColor}`}>Agroemprendedores de Turbo</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>58 consultas</p>
                  <p className={`text-[9px] ${mutedColor}`}>$28.000 cop</p>
                </div>
              </div>

              <div className={`p-2 rounded ${innerBg} border ${borderColor} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs font-bold ${titleColor}`}>2. Leidy Marulanda Technology</p>
                  <p className={`text-[10px] ${mutedColor}`}>Comercio Aliado Apartadó</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>42 consultas</p>
                  <p className={`text-[9px] ${mutedColor}`}>Tecnología & Móviles</p>
                </div>
              </div>

              <div className={`p-2 rounded ${innerBg} border ${borderColor} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs font-bold ${titleColor}`}>3. Fundación Jóvenes+</p>
                  <p className={`text-[10px] ${mutedColor}`}>Impacto Social Urabá</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>31 consultas</p>
                  <p className={`text-[9px] ${mutedColor}`}>Donaciones & Proyectos</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-2 border-t ${borderColor} text-[10px] ${mutedColor} mt-2`}>
            Concentran el 74% de la intención de compra y apoyo en la plataforma.
          </div>
        </div>

        {/* CARD DERECHA: TRÁFICO & CONVERSIONES (7 COLS) */}
        <div className={`lg:col-span-7 rounded-lg ${cardBg} p-4 flex flex-col justify-between`}>
          <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
            <h3 className={`text-xs font-black ${titleColor} uppercase tracking-wider`}>
              Tráfico & Tasa de Conversión
            </h3>
            <div className="flex items-center gap-2">
              <span className={`sm:hidden text-[9px] ${isDark ? 'text-cyan-400 bg-[#0f1824] border-cyan-500/30' : 'text-blue-600 bg-blue-50 border-blue-200'} font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border`}>
                <MoveHorizontal className="w-3 h-3" /> Desliza
              </span>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-blue-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Visitantes
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Conversión
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto touch-pan-x scrollbar-thin pb-1">
            <div className="min-w-[420px] sm:min-w-0 relative w-full h-40 sm:h-44 my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 450 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaAzul" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="areaNaranja" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="35" x2="430" y2="35" stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" opacity="0.5" />
              <line x1="20" y1="80" x2="430" y2="80" stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="3 3" opacity="0.5" />

              <path
                d="M 30 115 C 80 85, 120 70, 160 85 C 200 100, 240 70, 280 80 C 320 90, 360 70, 420 30 L 420 130 L 30 130 Z"
                fill="url(#areaAzul)"
              />
              <path
                d="M 30 115 C 80 85, 120 70, 160 85 C 200 100, 240 70, 280 80 C 320 90, 360 70, 420 30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="420" cy="30" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />

              <path
                d="M 30 125 C 80 105, 120 98, 160 115 C 200 125, 240 95, 280 105 C 320 115, 360 95, 420 60 L 420 130 L 30 130 Z"
                fill="url(#areaNaranja)"
              />
              <path
                d="M 30 125 C 80 105, 120 98, 160 115 C 200 125, 240 95, 280 105 C 320 115, 360 95, 420 60"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="420" cy="60" r="3" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            </div>
          </div>

          <div className={`pt-2 border-t ${borderColor} flex justify-between items-center text-xs`}>
            <span className={mutedColor}>
              Total Visitas: <strong className={titleColor}>184</strong>
            </span>
            <span className={mutedColor}>
              Tasa de Conversión: <strong className="text-orange-500 font-bold">4.2%</strong>
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4.5. ASESOR Y SIMULADOR DE DECISIÓN: INVERSIÓN EN MARKETING & EXPANSIÓN */}
      {/* ========================================================================= */}
      <div className={`rounded-lg ${cardBg} p-4 sm:p-5 space-y-4`}>
        
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b ${borderColor}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-600'} border flex items-center justify-center shrink-0`}>
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-sm font-black ${titleColor} uppercase tracking-wider`}>
                  Asesor de Decisión: Inversión en Marketing & Expansión Urabá
                </h3>
                <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800'} border text-[10px] font-bold flex items-center gap-1`}>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Dictamen: Aumento Recomendado (+30%)
                </span>
              </div>
              <p className={`text-[11px] ${mutedColor} mt-0.5`}>
                Simulador interactivo en tiempo real para análisis de junta y asignación de presupuesto regional
              </p>
            </div>
          </div>

          {/* Selector interactivo de simulación de presupuesto */}
          <div className={`flex items-center gap-1.5 ${innerBg} p-1 rounded-lg border ${borderColor} text-xs`}>
            <span className={`text-[10px] uppercase font-bold ${mutedColor} px-2 flex items-center gap-1`}>
              <Sliders className="w-3 h-3 text-cyan-500" /> Simular:
            </span>
            {[
              { val: 300000, label: '$300.000 COP' },
              { val: 600000, label: '$600.000 COP (Sugerido)' },
              { val: 1200000, label: '$1.200.000 COP' },
            ].map((btn) => (
              <button
                key={btn.val}
                type="button"
                onClick={() => setPresupuestoMkt(btn.val)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  presupuestoMkt === btn.val
                    ? isDark ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'bg-blue-600 text-white shadow-sm'
                    : `${mutedColor} hover:${titleColor}`
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENIDO DEL ANÁLISIS EN 3 COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Pilar 1: Diagnóstico de Tracción */}
          <div className={`p-3.5 rounded-lg ${innerBg} border ${borderColor} flex flex-col justify-between`}>
            <div>
              <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  1. Tracción Orgánica Actual
                </span>
                <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/20' : 'text-emerald-700 bg-emerald-100 border-emerald-200'} px-1.5 py-0.5 rounded border`}>
                  Validada
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} mt-2 leading-relaxed`}>
                Con <strong className={titleColor}>184 visitas iniciales</strong> y <strong className={titleColor}>38 conexiones boca a boca</strong> en Apartadó y Turbo, la plataforma ya tiene aceptación comunitaria sin gasto en pauta (CAC actual: <span className="text-emerald-500 font-bold">$0 COP</span>).
              </p>
            </div>
            <div className={`pt-2 border-t ${borderColor} mt-3 text-[11px] ${mutedColor}`}>
              Señales: <strong className={titleColor}>4.9 estrellas de satisfacción comunitaria</strong>
            </div>
          </div>

          {/* Pilar 2: Oportunidad Territorial No Explorada */}
          <div className={`p-3.5 rounded-lg ${innerBg} border ${borderColor} flex flex-col justify-between`}>
            <div>
              <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  2. Brecha Territorial
                </span>
                <span className={`text-[10px] font-bold ${isDark ? 'text-amber-300 bg-amber-950/60 border-amber-500/20' : 'text-amber-700 bg-amber-100 border-amber-200'} px-1.5 py-0.5 rounded border`}>
                  Alta Oportunidad
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} mt-2 leading-relaxed`}>
                Carepa, Chigorodó y Necoclí representan solo el <strong className={titleColor}>40% del tráfico</strong> pero concentran el 65% de los emprendedores agrícolas y artesanos. La pauta debe dirigirse allí.
              </p>
            </div>
            <div className={`pt-2 border-t ${borderColor} mt-3 text-[11px] ${mutedColor}`}>
              Canal clave: <strong className={titleColor}>WhatsApp Comunitario + Meta Ads Local</strong>
            </div>
          </div>

          {/* Pilar 3: Proyección con el presupuesto seleccionado */}
          <div className={`p-3.5 rounded-lg ${innerBg} border ${isDark ? 'border-cyan-500/30' : 'border-blue-400/50'} flex flex-col justify-between shadow-inner`}>
            <div>
              <div className={`flex items-center justify-between pb-2 border-b ${borderColor}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  3. Impacto Proyectado
                </span>
                <span className={`text-[10px] font-bold ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>
                  {(presupuestoMkt).toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className={mutedColor}>Nuevos Comercios:</span>
                  <strong className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                    +{presupuestoMkt === 300000 ? '18' : presupuestoMkt === 600000 ? '42' : '85'} comercios
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className={mutedColor}>Alcance Estimado Urabá:</span>
                  <strong className={titleColor}>
                    +{presupuestoMkt === 300000 ? '1.200' : presupuestoMkt === 600000 ? '2.800' : '5.400'} personas
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className={mutedColor}>Costo Adquisición (CAC):</span>
                  <strong className={isDark ? 'text-cyan-300' : 'text-blue-600'}>
                    ${presupuestoMkt === 300000 ? '16.600' : presupuestoMkt === 600000 ? '14.200' : '14.100'} COP
                  </strong>
                </div>
              </div>
            </div>
            <div className={`pt-2 border-t ${borderColor} mt-3 text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-semibold flex items-center gap-1`}>
              <Zap className="w-3 h-3 text-emerald-500" />
              Retorno estimado: {presupuestoMkt === 300000 ? '3.8x' : presupuestoMkt === 600000 ? '4.6x' : '4.2x'} en transacciones locales
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. MÓDULO INFERIOR AMPLIO: MAPA INTERACTIVO DE URABÁ, ANTIOQUIA Y COLOMBIA */}
      {/* ========================================================================= */}
      <div className={`rounded-lg ${cardBg} p-4 sm:p-5 space-y-4`}>
        
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${borderColor}`}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Navigation className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-black ${titleColor} uppercase tracking-wider`}>
                Mapa Territorial de Conectividad (Urabá • Antioquia • Colombia)
              </h3>
              <span className={`sm:hidden text-[9px] ${isDark ? 'text-emerald-400 bg-[#0f1824] border-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200'} font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border`}>
                <MoveHorizontal className="w-3 h-3" /> Desliza mapa
              </span>
            </div>
            <p className={`text-[11px] ${mutedColor} mt-0.5`}>
              Puntos de conexión en vivo con sombritas rojas difuminadas y flujo de tráfico hacia Medellín y el país
            </p>
          </div>

          {/* Filtros territoriales */}
          <div className={`flex items-center gap-1.5 ${innerBg} p-1 rounded border ${borderColor} text-[11px] font-bold`}>
            <button
              type="button"
              onClick={() => setMapaFiltro('uraba')}
              className={`px-2.5 py-1 rounded transition-all ${
                mapaFiltro === 'uraba' ? 'bg-emerald-600 text-white shadow-sm' : `${mutedColor} hover:${titleColor}`
              }`}
            >
              Urabá Central
            </button>
            <button
              type="button"
              onClick={() => setMapaFiltro('antioquia')}
              className={`px-2.5 py-1 rounded transition-all ${
                mapaFiltro === 'antioquia' ? 'bg-emerald-600 text-white shadow-sm' : `${mutedColor} hover:${titleColor}`
              }`}
            >
              Corredor Antioquia
            </button>
            <button
              type="button"
              onClick={() => setMapaFiltro('nacional')}
              className={`px-2.5 py-1 rounded transition-all ${
                mapaFiltro === 'nacional' ? 'bg-emerald-600 text-white shadow-sm' : `${mutedColor} hover:${titleColor}`
              }`}
            >
              Nacional (Colombia)
            </button>
          </div>
        </div>

        {/* CONTENEDOR DEL MAPA TERRITORIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* LIENZO SVG DEL MAPA TERRITORIAL COMPLETO (8 COLS) */}
          <div className={`lg:col-span-8 ${innerBg} rounded-lg border ${borderColor} p-3 relative overflow-x-auto touch-pan-x scrollbar-thin min-h-[300px] flex items-center justify-center`}>
            <div className="min-w-[540px] sm:min-w-0 w-full flex items-center justify-center">
            <svg className="w-full h-72 sm:h-80" viewBox="0 0 600 320">
              <defs>
                {/* SOMBRA DIFUMINADA ROJA APARTADÓ (ALTA INTENSIDAD) */}
                <radialGradient id="difuminadoApartado" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#f97316" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* SOMBRA DIFUMINADA ROJA TURBO (MEDIA INTENSIDAD) */}
                <radialGradient id="difuminadoTurbo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
                  <stop offset="40%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* SOMBRA DIFUMINADA MEDELLÍN / ANTIOQUIA */}
                <radialGradient id="difuminadoMedellin" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* SOMBRA DIFUMINADA SUAVE MUNICIPIOS */}
                <radialGradient id="difuminadoSuave" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Mar Caribe / Golfo de Urabá */}
              <path
                d="M 30 10 L 160 10 C 175 60, 185 100, 190 135 C 180 160, 150 170, 120 170 C 100 160, 95 130, 85 105 C 70 80, 45 55, 30 10 Z"
                fill="#0284c7"
                fillOpacity={isDark ? "0.15" : "0.08"}
              />
              <text x="80" y="70" fill={isDark ? "#38bdf8" : "#0284c7"} opacity="0.45" fontSize="10" fontWeight="bold">GOLFO DE URABÁ</text>

              {/* Contorno costero y división territorial */}
              <path
                d="M 30 10 Q 80 75 105 125 Q 135 170 175 145 Q 200 95 245 55 Q 280 40 330 25"
                fill="none"
                stroke={isDark ? "#334155" : "#cbd5e1"}
                strokeWidth="1.8"
              />

              {/* RUTA 1: RUTA AL MAR (Necoclí -> Turbo -> Apartadó -> Carepa -> Chigorodó -> Dabeiba) */}
              <path
                d="M 245 55 L 185 135 L 215 168 L 220 198 L 225 228 L 260 260 L 340 275"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />

              {/* RUTA 2: CORREDOR URABÁ A MEDELLÍN (Dabeiba -> Santa Fe de Antioquia -> Valle de Aburrá) */}
              <path
                d="M 225 228 Q 280 260 340 275 Q 390 280 415 285"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* RUTA 3: CONEXIÓN NACIONAL A BOGOTÁ */}
              <path
                d="M 415 285 Q 480 295 530 305"
                fill="none"
                stroke={isDark ? "#94a3b8" : "#94a3b8"}
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* 1. NODO NECOCLÍ (Costa Norte) */}
              <g onMouseEnter={() => setHoveredNodo('Necoclí')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="245" cy="55" r="16" fill="url(#difuminadoSuave)" className="animate-pulse" />
                <circle cx="245" cy="55" r="3" fill="#dc2626" />
                <text x="255" y="58" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight="bold">Necoclí (6)</text>
              </g>

              {/* 2. NODO TURBO (Puerto & Comercio) */}
              <g onMouseEnter={() => setHoveredNodo('Turbo')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="185" cy="135" r="26" fill="url(#difuminadoTurbo)" className="animate-pulse" />
                <circle cx="185" cy="135" r="4" fill="#ef4444" />
                <text x="135" y="138" fill={isDark ? "#f8fafc" : "#0f172a"} fontSize="9" fontWeight="black">Turbo (24)</text>
              </g>

              {/* 3. NODO APARTADÓ (DISTRITO CENTRAL - MAYOR CALOR ROJO) */}
              <g onMouseEnter={() => setHoveredNodo('Apartadó')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="215" cy="168" r="36" fill="url(#difuminadoApartado)" className="animate-pulse" />
                <circle cx="215" cy="168" r="5" fill="#b91c1c" />
                <circle cx="215" cy="168" r="9" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" />
                <text x="230" y="171" fill={isDark ? "#f87171" : "#dc2626"} fontSize="10" fontWeight="black">Apartadó (42)</text>
              </g>

              {/* 4. NODO CAREPA */}
              <g onMouseEnter={() => setHoveredNodo('Carepa')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="220" cy="198" r="18" fill="url(#difuminadoSuave)" className="animate-pulse" />
                <circle cx="220" cy="198" r="3" fill="#dc2626" />
                <text x="232" y="201" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight="bold">Carepa (14)</text>
              </g>

              {/* 5. NODO CHIGORODÓ */}
              <g onMouseEnter={() => setHoveredNodo('Chigorodó')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="225" cy="228" r="16" fill="url(#difuminadoSuave)" className="animate-pulse" />
                <circle cx="225" cy="228" r="3" fill="#dc2626" />
                <text x="237" y="231" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight="bold">Chigorodó (10)</text>
              </g>

              {/* 6. NODO MEDELLÍN / VALLE DE ABURRÁ (ANTIOQUIA) */}
              <g onMouseEnter={() => setHoveredNodo('Medellín')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="415" cy="285" r="22" fill="url(#difuminadoMedellin)" className="animate-pulse" />
                <circle cx="415" cy="285" r="4" fill="#38bdf8" />
                <text x="360" y="298" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="9" fontWeight="bold">Medellín & Valle de Aburrá (15)</text>
              </g>

              {/* 7. NODO BOGOTÁ / RESTO DEL PAÍS */}
              <g onMouseEnter={() => setHoveredNodo('Bogotá')} onMouseLeave={() => setHoveredNodo(null)} className="cursor-pointer">
                <circle cx="530" cy="305" r="18" fill="url(#difuminadoMedellin)" opacity="0.6" />
                <circle cx="530" cy="305" r="3" fill="#818cf8" />
                <text x="475" y="318" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight="bold">Bogotá D.C. & País (12)</text>
              </g>

            </svg>
            </div>

            {/* Badge flotante de ayuda */}
            <div className={`absolute top-2 left-2 ${innerBg} border ${borderColor} px-2 py-1 rounded text-[9px] font-bold ${mutedColor} flex items-center gap-1.5 shadow-sm`}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Sombritas rojas: Difusión activa persona a persona en Urabá</span>
            </div>
          </div>

          {/* PANEL LATERAL DE MÉTRICAS TERRITORIALES (4 COLS) */}
          <div className="lg:col-span-4 space-y-2.5">
            
            <div className={`p-3 rounded ${innerBg} border ${borderColor}`}>
              <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} uppercase tracking-wider`}>
                Eje Principal
              </span>
              <p className={`text-xs font-bold ${titleColor} mt-0.5`}>
                Subregión de Urabá
              </p>
              <p className={`text-xl font-black ${titleColor} mt-1`}>
                157 <span className={`text-xs font-normal ${mutedColor}`}>visitas (85%)</span>
              </p>
              <div className={`w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} h-1.5 rounded-full mt-2 overflow-hidden`}>
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className={`p-3 rounded ${innerBg} border ${borderColor}`}>
              <span className={`text-[10px] font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'} uppercase tracking-wider`}>
                Conexión Departamental
              </span>
              <p className={`text-xs font-bold ${titleColor} mt-0.5`}>
                Medellín & Valle de Aburrá
              </p>
              <p className={`text-xl font-black ${titleColor} mt-1`}>
                15 <span className={`text-xs font-normal ${mutedColor}`}>visitas (8%)</span>
              </p>
              <div className={`w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} h-1.5 rounded-full mt-2 overflow-hidden`}>
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '8%' }} />
              </div>
            </div>

            <div className={`p-3 rounded ${innerBg} border ${borderColor}`}>
              <span className={`text-[10px] font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} uppercase tracking-wider`}>
                Alcance Nacional
              </span>
              <p className={`text-xs font-bold ${titleColor} mt-0.5`}>
                Bogotá & Otras Ciudades
              </p>
              <p className={`text-xl font-black ${titleColor} mt-1`}>
                12 <span className={`text-xs font-normal ${mutedColor}`}>visitas (7%)</span>
              </p>
              <div className={`w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} h-1.5 rounded-full mt-2 overflow-hidden`}>
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
