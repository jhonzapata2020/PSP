import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sun,
  Moon
} from 'lucide-react';
import { companiesApi } from '../../services/companiesApi';
import CompaniesCrudTable from '../../components/admin/CompaniesCrudTable';
import AuditorioPresenterTools from '../../components/common/AuditorioPresenterTools';

const AdminEmpresasPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Control de Tema Exclusivo e Independiente del CRUD (No altera la barra lateral ni la app global)
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem('psp_empresas_dashboard_theme') || 'dark';
  });
  const isDark = dashboardTheme === 'dark';

  const toggleDashboardTheme = () => {
    setDashboardTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('psp_empresas_dashboard_theme', next);
      return next;
    });
  };

  // Paleta Ejecutiva:
  // Modo Oscuro: Azul marino y pizarra ejecutivos (#111c2a / #182638 / #0f1824) - NUNCA negro carbón.
  // Modo Claro: Blanco grisáceo suave (#eef2f6 / #f8fafc) - NUNCA blanco plano ni contrastes duros.
  const bgMain = isDark ? 'bg-[#111c2a]' : 'bg-[#eef2f6]';
  const cardBg = isDark
    ? 'bg-[#182638] border border-slate-700/60 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)]'
    : 'bg-[#f8fafc] border border-slate-300/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)]';
  const innerBg = isDark ? 'bg-[#0f1824]' : 'bg-[#edf2f7]';
  const titleColor = isDark ? 'text-white' : 'text-slate-800';
  const mutedColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-slate-300/80';

  // Modo Pantalla Completa / Presentación (Kiosk Mode)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

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

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companiesApi.list();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleResetDemo = () => {
    if (window.confirm('¿Deseas restaurar el catálogo original por defecto?')) {
      const restored = companiesApi.resetToDefaults();
      setCompanies(restored);
    }
  };

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? `fixed inset-0 z-[9999] ${bgMain} overflow-y-auto p-3 sm:p-6 space-y-4 font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'} select-none w-screen h-screen relative`
          : `-m-3 sm:-m-6 p-3 sm:p-5 ${bgMain} min-h-[calc(100vh-80px)] space-y-4 select-none font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'} relative`
      }
    >
      {/* HERRAMIENTAS DE AUDITORIO: PUNTERO LÁSER, LÁPIZ INTELIGENTE Y CALIGRAFÍA CURSIVA */}
      <AuditorioPresenterTools
        containerRef={containerRef}
        isDark={isDark}
        isFullscreen={isFullscreen}
      />

      {/* BANNER SUPERIOR CON CONTROLES DE PRESENTACIÓN */}
      <div className={`rounded-2xl ${cardBg} p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-teal-50 border-teal-200 text-teal-700'} border flex items-center justify-center shrink-0`}>
            <Building2 className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span>Módulo CRUD · Administrador</span>
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Convenios Activos</span>
              </span>
            </div>

            <h1 className={`text-lg sm:text-xl font-extrabold ${titleColor} tracking-tight mt-1`}>
              Directorio de Empresas Aliadas (CRUD)
            </h1>
            <p className={`text-xs ${mutedColor} mt-0.5 max-w-2xl`}>
              Sube logos desde tu computador, actualiza el objeto social, la categoría, el % de descuento y gestiona convenios comerciales en Urabá.
            </p>
          </div>
        </div>

        {/* Acciones: Switch Tema Pinterest, Pantalla Completa & Restaurar */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          {/* BOTÓN DISCRETO TEMA CLARO / OSCURO (ESTILO PINTEREST) */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${borderColor} ${innerBg} shadow-inner`}>
            <button
              type="button"
              onClick={toggleDashboardTheme}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
              style={{ backgroundColor: isDark ? '#1e293b' : '#cbd5e1' }}
              title={isDark ? 'Cambiar a tema Blanco Gris' : 'Cambiar a tema Azul Marino'}
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

          {/* BOTÓN PANTALLA COMPLETA */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
              isFullscreen
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                : isDark
                ? 'bg-[#0f1824] hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/40'
                : 'bg-[#edf2f7] hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir a pantalla completa para presentar'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Salir Pantalla Completa</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expandir</span>
              </>
            )}
          </button>

          {/* RESTAURAR ORIGINALES */}
          <button
            type="button"
            onClick={handleResetDemo}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              isDark
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
            title="Restaurar lista original por defecto"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restaurar</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO CRUD */}
      {loading ? (
        <div className={`py-20 text-center text-sm font-semibold ${mutedColor}`}>
          Cargando directorio de empresas aliadas...
        </div>
      ) : (
        <CompaniesCrudTable
          companies={companies}
          onRefresh={loadCompanies}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default AdminEmpresasPage;
