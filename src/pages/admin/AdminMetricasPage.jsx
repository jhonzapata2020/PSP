import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart3,
  TrendingUp,
  Flame,
  MousePointerClick,
  Users,
  Eye,
  Clock,
  Globe,
  MapPin,
  Smartphone,
  Monitor,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Play,
  Pause,
  X,
  CheckCircle2,
  Calendar,
  Filter,
  ShieldCheck,
  ShoppingBag,
  Building2,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function AdminMetricasPage() {
  const [periodo, setPeriodo] = useState('hoy'); // 'hoy' | 'semana' | 'mes'
  const [activeTabHeatmap, setActiveTabHeatmap] = useState('carrusel'); // 'carrusel' | 'botones' | 'tienda'
  const [canalFiltro, setCanalFiltro] = useState('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveUsersCount, setLiveUsersCount] = useState(14);
  const [showClarityModal, setShowClarityModal] = useState(false);
  const [isSimulatingVideo, setIsSimulatingVideo] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);

  // Simulación de fluctuación de usuarios activos en vivo (12 a 18)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsersCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const next = prev + delta;
        return next < 10 ? 11 : next > 22 ? 18 : next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Simulación de reproducción en el modal de Clarity
  useEffect(() => {
    if (!showClarityModal || !isSimulatingVideo) return;
    const timer = setInterval(() => {
      setVideoProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 250);
    return () => clearInterval(timer);
  }, [showClarityModal, isSimulatingVideo]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Datos adaptados a una plataforma regional en etapa de crecimiento
  const metricasPorPeriodo = {
    hoy: {
      visitas: '184',
      visitasDiff: '+16.5%',
      usuariosUnicos: '129',
      tiempoPromedio: '2m 45s',
      tiempoDiff: '+24s',
      tasaRebote: '34.2%',
      clicsTotales: '412',
      ctrGlobal: '8.4%',
      municipios: [
        { nombre: 'Apartadó', visitas: 78, pct: 42, color: 'bg-emerald-500' },
        { nombre: 'Turbo', visitas: 36, pct: 20, color: 'bg-teal-500' },
        { nombre: 'Carepa', visitas: 24, pct: 13, color: 'bg-cyan-500' },
        { nombre: 'Chigorodó', visitas: 19, pct: 10, color: 'bg-emerald-400' },
        { nombre: 'Medellín & Valle de Aburrá', visitas: 15, pct: 8, color: 'bg-blue-500' },
        { nombre: 'Necoclí y Resto País', visitas: 12, pct: 7, color: 'bg-indigo-400' },
      ],
      dispositivos: { movil: 78, desktop: 20, tablet: 2 },
    },
    semana: {
      visitas: '1,240',
      visitasDiff: '+28.2%',
      usuariosUnicos: '890',
      tiempoPromedio: '3m 10s',
      tiempoDiff: '+38s',
      tasaRebote: '31.8%',
      clicsTotales: '2,890',
      ctrGlobal: '9.1%',
      municipios: [
        { nombre: 'Apartadó', visitas: 510, pct: 41, color: 'bg-emerald-500' },
        { nombre: 'Turbo', visitas: 260, pct: 21, color: 'bg-teal-500' },
        { nombre: 'Carepa', visitas: 170, pct: 14, color: 'bg-cyan-500' },
        { nombre: 'Chigorodó', visitas: 130, pct: 10, color: 'bg-emerald-400' },
        { nombre: 'Medellín & Valle de Aburrá', visitas: 110, pct: 9, color: 'bg-blue-500' },
        { nombre: 'Necoclí y Resto País', visitas: 60, pct: 5, color: 'bg-indigo-400' },
      ],
      dispositivos: { movil: 81, desktop: 17, tablet: 2 },
    },
    mes: {
      visitas: '4,860',
      visitasDiff: '+42.0%',
      usuariosUnicos: '3,420',
      tiempoPromedio: '2m 58s',
      tiempoDiff: '+15s',
      tasaRebote: '33.1%',
      clicsTotales: '11,400',
      ctrGlobal: '8.8%',
      municipios: [
        { nombre: 'Apartadó', visitas: 2010, pct: 41, color: 'bg-emerald-500' },
        { nombre: 'Turbo', visitas: 1020, pct: 21, color: 'bg-teal-500' },
        { nombre: 'Carepa', visitas: 680, pct: 14, color: 'bg-cyan-500' },
        { nombre: 'Chigorodó', visitas: 490, pct: 10, color: 'bg-emerald-400' },
        { nombre: 'Medellín & Valle de Aburrá', visitas: 410, pct: 9, color: 'bg-blue-500' },
        { nombre: 'Necoclí y Resto País', visitas: 250, pct: 5, color: 'bg-indigo-400' },
      ],
      dispositivos: { movil: 80, desktop: 18, tablet: 2 },
    },
  };

  const dataActual = metricasPorPeriodo[periodo];

  // Datos del mapa de calor de las 5 diapositivas del carrusel Hero
  const heatCarrusel = [
    {
      id: 1,
      titulo: '1. Misión Social & Propósito PSP',
      archivo: 'hero-banner-psp.png',
      rol: 'Institucional',
      clics: 68,
      atencionPct: 35,
      temp: 'Fuego',
      tempColor: 'text-red-500 bg-red-500/10 border-red-500/20',
      barraColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      id: 2,
      titulo: '2. Empresas & Fundaciones Aliadas',
      archivo: 'hero-slide-aliadas.png',
      rol: 'Alianza Empresarial',
      clics: 34,
      atencionPct: 18,
      temp: 'Cálido',
      tempColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      barraColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
    },
    {
      id: 3,
      titulo: '3. Comercio Justo & Urabá Emprende',
      archivo: 'hero-slide-comercio.png',
      rol: 'PyMEs y Agro',
      clics: 41,
      atencionPct: 22,
      temp: 'Cálido',
      tempColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barraColor: 'bg-gradient-to-r from-teal-400 to-emerald-500',
    },
    {
      id: 4,
      titulo: '4. Tienda Online & Pagos Seguros',
      archivo: 'hero-slide-ecommerce.png',
      rol: 'Comunidad / Compra',
      clics: 29,
      atencionPct: 15,
      temp: 'Templado',
      tempColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      barraColor: 'bg-cyan-500',
    },
    {
      id: 5,
      titulo: '5. PSP GO Domicilios & Movilidad',
      archivo: 'hero-slide-pspgo.png',
      rol: 'Logística & Empleo',
      clics: 20,
      atencionPct: 10,
      temp: 'Templado',
      tempColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      barraColor: 'bg-blue-500',
    },
  ];

  // Datos de botones de acción más pulsados
  const heatBotones = [
    { boton: 'Ir a Tienda / Explorar Catálogo', seccion: 'Header / Carrusel', clics: 114, conversion: '14.2%' },
    { boton: 'Conectar Empresas Aliadas (/empresas)', seccion: 'Banner 2', clics: 46, conversion: '8.1%' },
    { boton: 'PSP GO Domicilios Express', seccion: 'Banner 5 & Navbar', clics: 38, conversion: '6.4%' },
    { boton: 'Iniciar Sesión / Registro Ciudadano', seccion: 'Header Top', clics: 52, conversion: '18.9%' },
    { boton: 'Añadir al Carrito (Productos Urabá)', seccion: 'Home Showcase', clics: 42, conversion: '22.0%' },
  ];

  // Top aliados y productos más consultados
  const topEntidades = [
    { nombre: 'Leidy Marulanda Technology', cat: 'Comercio Aliado', vistas: 94, accion: '23 compras' },
    { nombre: 'Fundación Jóvenes+', cat: 'Impacto Social', vistas: 71, accion: '12 donaciones' },
    { nombre: 'Agroemprendedores de Turbo', cat: 'Agro & Snacks', vistas: 58, accion: '19 pedidos' },
    { nombre: 'Puerto Antioquia S.A.', cat: 'Infraestructura', vistas: 47, accion: 'Consulta institucional' },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER PRINCIPAL DEL CENTRO DE CONTROL */}
      <div className="rounded-3xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 sm:p-7 relative overflow-hidden">
        
        {/* Resplandor ambiental de fondo */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Telemetría en Vivo
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-psp-teal dark:text-psp-cyan" />
                Motor: Google Analytics 4 & Clarity
              </span>
            </div>

            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Centro de Control de Métricas & Tráfico
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Monitoreo en tiempo real del impacto social, interacción ciudadana, procedencia territorial y mapas de calor sobre los componentes de PSP.
            </p>
          </div>

          {/* Filtros de período y botón de recarga */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
              {[
                { id: 'hoy', label: 'Hoy' },
                { id: 'semana', label: '7 Días' },
                { id: 'mes', label: '30 Días' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriodo(p.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    periodo === p.id
                      ? 'bg-psp-cyan text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refrescar métricas"
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-psp-teal dark:text-psp-cyan' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setShowClarityModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#0c4236] hover:bg-[#083027] text-white text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>Ver Grabaciones Clarity</span>
            </button>
          </div>
        </div>

        {/* CINTA DE ESTADO ACTIVO EN VIVO */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {liveUsersCount} personas navegando en la plataforma en este momento
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Anonimización RGPD Activa
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Latencia API: 14ms
            </span>
          </div>
        </div>
      </div>

      {/* TARJETAS DE KPIS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Visitas */}
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Visitas Totales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dataActual.visitas}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {dataActual.visitasDiff}
            </span>
            <span className="text-slate-400">• {dataActual.usuariosUnicos} usuarios únicos</span>
          </div>
        </div>

        {/* KPI 2: Clics e Interacción */}
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Clics en Contenido</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dataActual.clicsTotales}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-bold text-teal-700 dark:text-teal-400">CTR {dataActual.ctrGlobal}</span>
            <span className="text-slate-400">• Botones & Banners</span>
          </div>
        </div>

        {/* KPI 3: Permanencia Promedio */}
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tiempo en Plataforma</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dataActual.tiempoPromedio}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-bold text-cyan-700 dark:text-cyan-400">{dataActual.tiempoDiff} vs anterior</span>
            <span className="text-slate-400">• Alta retención</span>
          </div>
        </div>

        {/* KPI 4: Tasa de Rebote Saludable */}
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tasa de Rebote</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dataActual.tasaRebote}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Nivel Óptimo (&lt; 40%)</span>
            <span className="text-slate-400">• Interés real</span>
          </div>
        </div>
      </div>

      {/* BLOQUE DE MAPA GEOGRÁFICO DE URABÁ Y DISPOSITIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Distribución Territorial (Urabá y Antioquia) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Procedencia Territorial de las Visitas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Concentración geográfica del tráfico en los municipios de Urabá y principales ciudades
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Geo-IP Precisa
            </span>
          </div>

          {/* Barras de distribución por municipio */}
          <div className="space-y-3.5 mt-5">
            {dataActual.municipios.map((m) => (
              <div key={m.nombre}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${m.color}`} />
                    {m.nombre}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{m.visitas} visitas</span>
                    <span className="font-extrabold text-slate-900 dark:text-white w-10 text-right">{m.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.color} transition-all duration-700`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Nota de impacto comunitario */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Globe className="w-4 h-4 text-psp-teal dark:text-psp-cyan shrink-0" />
            <span>
              <strong>El 85% del tráfico proviene directamente de la subregión de Urabá</strong>, confirmando la adopción comunitaria local y el interés en los comercios aliados.
            </span>
          </div>
        </div>

        {/* Dispositivos y Canales de Ingreso */}
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Dispositivos de Conexión
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Cómo experimentan los usuarios la plataforma
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> Teléfonos Móviles
                  </span>
                  <span>{dataActual.dispositivos.movil}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dataActual.dispositivos.movil}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-teal-500" /> Computadores de Escritorio
                  </span>
                  <span>{dataActual.dispositivos.desktop}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${dataActual.dispositivos.desktop}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-500" /> Tablets & Otros
                  </span>
                  <span>{dataActual.dispositivos.tablet}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${dataActual.dispositivos.tablet}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            💡 <strong>Estrategia recomendada:</strong> Al tener casi un 80% de tráfico en celulares, los botones táctiles y la velocidad móvil son la prioridad número 1 de conversión.
          </div>
        </div>
      </div>

      {/* MAPA DE CALOR NATIVO: COMPONENTES Y DIAPOSITIVAS MÁS CLICKEADAS */}
      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Mapa de Calor de Clics (Interacción en Pantalla)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mide qué elementos despiertan mayor curiosidad y acción directa por parte de los visitantes
            </p>
          </div>

          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTabHeatmap('carrusel')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabHeatmap === 'carrusel'
                  ? 'bg-psp-cyan text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              5 Banners del Carrusel
            </button>
            <button
              type="button"
              onClick={() => setActiveTabHeatmap('botones')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabHeatmap === 'botones'
                  ? 'bg-psp-cyan text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Botones Principales
            </button>
          </div>
        </div>

        {/* TAB 1: CALOR EN EL CARRUSEL HERO */}
        {activeTabHeatmap === 'carrusel' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Distribución de atención de los usuarios en la secuencia narrativa del nuevo carrusel institucional y social:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {heatCarrusel.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between hover:border-psp-teal/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase">{item.rol}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${item.tempColor}`}>
                        {item.temp}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {item.titulo}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{item.clics} clics</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">{item.atencionPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${item.barraColor}`} style={{ width: `${item.atencionPct * 2}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-3.5 rounded-xl">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <strong>Conclusión de Impacto:</strong> La posición 1 institucional y la posición 3 de PyMEs/comercio justo capturan más del 57% del interés inicial del usuario.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: CALOR EN BOTONES PRINCIPALES */}
        {activeTabHeatmap === 'botones' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {heatBotones.map((b) => (
              <div key={b.boton} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{b.boton}</p>
                  <p className="text-[11px] text-slate-400">Ubicación: {b.seccion}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{b.clics} clics registrados</span>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold border border-teal-500/20">
                    Conversión {b.conversion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOP ENTIDADES Y COMERCIOS MÁS CONSULTADOS */}
      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-psp-teal dark:text-psp-cyan" />
              Entidades & Comercios con Mayor Atracción
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cuáles micrositios y perfiles están recibiendo mayor atención ciudadana
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Última actualización: hace 3 min</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topEntidades.map((ent) => (
            <div
              key={ent.nombre}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-psp-teal dark:text-psp-cyan">
                {ent.cat}
              </span>
              <h3 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">
                {ent.nombre}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {ent.vistas} vistas
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{ent.accion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL SIMULADOR DE GRABACIONES DE SESIÓN MICROSOFT CLARITY */}
      {showClarityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col">
            
            {/* Cabecera del reproductor */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <span>Visor de Sesión Anónima • Microsoft Clarity</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      ID: #ses_892b1a
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dispositivo: Samsung Galaxy A54 • Apartadó, Urabá • Origen: WhatsApp Campaña
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowClarityModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pantalla simulada del visor de sesión */}
            <div className="relative bg-slate-950 p-6 flex items-center justify-center min-h-[320px] overflow-hidden select-none">
              
              {/* Wireframe de la web de PSP */}
              <div className="w-full max-w-lg bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl relative">
                
                {/* Header wireframe */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/30" />
                    <div className="w-20 h-3 bg-slate-700 rounded" />
                  </div>
                  <div className="w-12 h-3 bg-slate-700 rounded" />
                </div>

                {/* Banner carrusel wireframe */}
                <div className="mt-3 w-full h-28 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-800 border border-emerald-500/30 relative flex items-center px-4">
                  <div className="space-y-1.5">
                    <div className="w-32 h-3.5 bg-emerald-400/60 rounded" />
                    <div className="w-48 h-2.5 bg-slate-400/40 rounded" />
                  </div>

                  {/* Cursor interactivo simulado */}
                  <div
                    className="absolute w-5 h-5 rounded-full bg-cyan-400/60 border border-white shadow-lg pointer-events-none transition-all duration-300"
                    style={{
                      left: `${20 + (videoProgress % 60)}%`,
                      top: `${30 + (videoProgress % 40)}%`,
                    }}
                  >
                    <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping" />
                  </div>
                </div>

                {/* Botones wireframe */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg bg-slate-800 border border-slate-700/50" />
                  <div className="h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30" />
                  <div className="h-10 rounded-lg bg-slate-800 border border-slate-700/50" />
                </div>
              </div>
            </div>

            {/* Controles de reproducción */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSimulatingVideo(!isSimulatingVideo)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  {isSimulatingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  0:{videoProgress < 10 ? `0${videoProgress}` : videoProgress} / 1:20
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer">
                <div className="h-full bg-psp-cyan rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
              </div>

              <span className="text-[11px] font-bold text-slate-400">Velocidad 1.0x</span>
            </div>

            {/* Footer con nota de producción */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>
                💡 Las grabaciones completas en producción se sincronizan automáticamente con tu ID de Microsoft Clarity sin consumir espacio en tu base de datos.
              </span>
              <button
                type="button"
                onClick={() => setShowClarityModal(false)}
                className="text-white hover:underline font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
