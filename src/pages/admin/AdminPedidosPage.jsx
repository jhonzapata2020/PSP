import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  MapPin, 
  CreditCard, 
  Banknote, 
  Store, 
  Truck, 
  Calendar, 
  X, 
  CheckCircle, 
  Clock, 
  PackageCheck, 
  AlertCircle,
  Copy,
  Check,
  Building2,
  DollarSign,
  TrendingUp,
  Package,
  Maximize2,
  Minimize2,
  Sun,
  Moon
} from 'lucide-react';
import ordersApi from '../../services/ordersApi';
import { calculateOrderFinancialBreakdown, getPaymentDisplayInfo } from '../../utils/orderTaxUtils';
import AuditorioPresenterTools from '../../components/common/AuditorioPresenterTools';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' },
  preparing: { label: 'En Preparación', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  ready_to_ship: { label: 'Listo para Despacho', bg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  shipped: { label: 'En Camino', bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' },
  delivered: { label: 'Entregado', bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  cancelled: { label: 'Cancelado', bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' },
  pending: { label: 'Pendiente', bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' },
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Control de Tema Exclusivo e Independiente del Módulo de Pedidos y Domicilios
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem('psp_pedidos_dashboard_theme') || 'dark';
  });
  const isDark = dashboardTheme === 'dark';

  const toggleDashboardTheme = () => {
    setDashboardTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('psp_pedidos_dashboard_theme', next);
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

  // Modal de Detalle y Auditoría
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedTxId, setCopiedTxId] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getAdminOrders({ 
        status: statusFilter || undefined, 
        page, 
        pageSize: 25 
      });
      setOrders(res?.items || []);
      setTotal(res?.total || 0);
    } catch (err) {
      setError(err.message || 'Error al cargar los pedidos de la plataforma.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, page]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  // Filtrado local por término de búsqueda (Número de orden, comprador o correo)
  const filteredOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.buyerName?.toLowerCase().includes(q) ||
      o.buyerEmail?.toLowerCase().includes(q) ||
      o.shippingMunicipality?.toLowerCase().includes(q)
    );
  });

  // Métricas rápidas (KPIs)
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const inProgressCount = orders.filter(o => ['confirmed', 'preparing', 'ready_to_ship', 'shipped'].includes(o.status)).length;

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
      
      {/* Encabezado con Controles de Exposición */}
      <div className={`rounded-2xl ${cardBg} p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-teal-50 border-teal-200 text-teal-700'} border flex items-center justify-center shrink-0`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span>Módulo Operativo & Logística</span>
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Despachos en Vivo</span>
              </span>
            </div>

            <h1 className={`text-lg sm:text-xl font-extrabold ${titleColor} tracking-tight mt-1 flex items-center gap-2`}>
              Administración Global de Pedidos & Domicilios
            </h1>
            <p className={`text-xs ${mutedColor} mt-0.5 max-w-2xl`}>
              Supervisión de despachos, repartidores, auditoría de pasarelas de pago y liquidación neta a comercios en Urabá.
            </p>
          </div>
        </div>

        {/* Acciones: Switch Tema Pinterest, Pantalla Completa & Actualizar */}
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

          {/* ACTUALIZAR */}
          <button
            type="button"
            onClick={loadOrders}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              isDark
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-2xl ${cardBg} flex items-center gap-3 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedColor}`}>Total Pedidos</p>
            <p className={`text-lg font-black ${titleColor}`}>{total}</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${cardBg} flex items-center gap-3 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedColor}`}>Ventas en Vista</p>
            <p className="text-lg font-black text-emerald-400">${totalSales.toLocaleString()} COP</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${cardBg} flex items-center gap-3 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedColor}`}>En Despacho / Tránsito</p>
            <p className="text-lg font-black text-blue-400">{inProgressCount}</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${cardBg} flex items-center gap-3 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedColor}`}>Entregados con Éxito</p>
            <p className="text-lg font-black text-indigo-400">{deliveredCount}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número de orden (PSP-...), comprador, email o municipio..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
              isDark
                ? 'bg-[#0f1824] border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold focus:outline-none cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#0f1824] border-slate-700/80 text-slate-200 focus:border-cyan-400'
                : 'bg-white border-slate-200 text-slate-700 focus:border-teal-500'
            }`}
          >
            <option value="" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>Todos los Estados</option>
            <option value="confirmed" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>Confirmados</option>
            <option value="preparing" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>En Preparación</option>
            <option value="ready_to_ship" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>Listo para Despacho</option>
            <option value="shipped" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>En Camino</option>
            <option value="delivered" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>Entregados</option>
            <option value="cancelled" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>Cancelados</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de Pedidos */}
      <div className={`rounded-2xl border transition-colors overflow-hidden ${
        isDark ? 'border-slate-700/60 bg-[#182638] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.35)]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        {loading ? (
          <div className={`p-12 text-center ${mutedColor} font-bold text-xs flex flex-col items-center gap-2`}>
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Cargando pedidos de la plataforma...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-500" />
            <p className="font-bold text-xs">No se encontraron pedidos con los criterios actuales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`text-[11px] uppercase tracking-wider font-extrabold border-b transition-colors ${
                isDark ? 'bg-[#0f1824] text-slate-300 border-slate-700/70' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3.5 px-4">Orden</th>
                  <th className="py-3.5 px-4">Comprador</th>
                  <th className="py-3.5 px-4">Municipio</th>
                  <th className="py-3.5 px-4">Comercios Aliados</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-center">Medio de Pago</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-medium transition-colors ${isDark ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                {filteredOrders.map((o) => {
                  const statusCfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                  const isOnline = Boolean(o.paymentTransactionId || o.paidAt);

                  return (
                    <tr key={o.id} className={`transition-colors ${
                      isDark ? 'hover:bg-[#1a293d]/70 text-slate-200' : 'hover:bg-slate-50/70 text-slate-700'
                    }`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isDark ? 'text-cyan-300' : 'text-slate-900'}`}>
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-bold truncate max-w-[150px] ${titleColor}`}>{o.buyerName}</div>
                        <div className={`text-[10px] truncate max-w-[150px] ${mutedColor}`}>{o.buyerEmail}</div>
                      </td>
                      <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {o.shippingMunicipality || 'Apartadó'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {o.subOrders?.map((sub) => (
                            <span 
                              key={sub.id} 
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                isDark ? 'bg-[#0f1824] border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {sub.companyName || 'Comercio Local'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-right font-extrabold ${titleColor}`}>
                        ${o.totalAmount?.toLocaleString()} COP
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOnline 
                            ? isDark ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDark ? 'bg-amber-950/70 text-amber-300 border-amber-500/40' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isOnline ? 'Wompi / Pagado' : 'Contraentrega'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusCfg.bg}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer border ${
                            isDark 
                              ? 'bg-[#0f1824] border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/60' 
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Auditar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE AUDITORÍA DETALLADA Y DESGLOSE FINANCIERO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#182638] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            
            {/* Header del Modal */}
            <div className={`flex items-start justify-between border-b pb-4 ${isDark ? 'border-slate-700/60' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`font-mono font-black text-lg ${isDark ? 'text-cyan-300' : 'text-slate-900'}`}>
                    {selectedOrder.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_CONFIG[selectedOrder.status]?.bg || ''}`}>
                    {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <p className={`text-xs ${mutedColor} mt-1`}>
                  Creado el: {new Date(selectedOrder.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Datos del Comprador y Destino */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0f1824] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Datos del Comprador</span>
                <p className="font-bold text-white">{selectedOrder.buyerName}</p>
                <p className={mutedColor}>{selectedOrder.buyerEmail}</p>
                <p className={mutedColor}>Tel: {selectedOrder.buyerPhone}</p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0f1824] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destino de Entrega</span>
                <p className="font-bold text-white">{selectedOrder.shippingAddress}</p>
                {selectedOrder.shippingNeighborhood && <p className={mutedColor}>Barrio: {selectedOrder.shippingNeighborhood}</p>}
                <p className={mutedColor}>{selectedOrder.shippingMunicipality}, Antioquia</p>
              </div>
            </div>

            {/* Auditoría Bancaria / Transacción Wompi */}
            {(() => {
              const adminFin = calculateOrderFinancialBreakdown(selectedOrder);
              const adminPay = getPaymentDisplayInfo(selectedOrder);

              return (
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                    adminPay.isOnline 
                      ? isDark ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200' : 'bg-teal-50 border-teal-200 text-teal-800'
                      : isDark ? 'bg-amber-950/40 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-2">
                        {adminPay.isOnline ? (
                          <CreditCard className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Banknote className="w-4 h-4 text-amber-400" />
                        )}
                        <span>{adminPay.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        adminPay.isOnline 
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' 
                          : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                      }`}>
                        {adminPay.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/50">
                      <div>
                        <span className="text-slate-400 block">Pasarela:</span>
                        <strong>{adminPay.gateway || 'Pago en Efectivo'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Franquicia / Medio:</span>
                        <strong>{adminPay.cardBrand || 'Efectivo'} {adminPay.lastFour}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">ID Transacción:</span>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-cyan-300 truncate">
                          <span>{adminPay.transactionId || 'N/A'}</span>
                          {adminPay.transactionId && (
                            <button onClick={() => copyToClipboard(adminPay.transactionId)} className="p-0.5 hover:text-cyan-400 cursor-pointer">
                              {copiedTxId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Autorización Bancaria:</span>
                        <span className="font-mono font-bold text-slate-200">{adminPay.authorizationCode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desglose Financiero y Tarifas de Domicilio */}
                  <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    isDark ? 'bg-[#0f1824] border-slate-700/70' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Artículos:</span>
                      <span className="font-semibold text-white">${adminFin.subtotal.toLocaleString()} COP</span>
                    </div>
                    {adminFin.discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Descuento Aplicado:</span>
                        <span>-${adminFin.discount.toLocaleString()} COP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                      <span>Base Gravable (19%):</span>
                      <span className="font-mono">${adminFin.baseGravable19.toLocaleString()} COP</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>IVA 19% Discriminado:</span>
                      <span className="font-mono font-semibold text-slate-300">${adminFin.iva19.toLocaleString()} COP</span>
                    </div>
                    {adminFin.totalExempt > 0 && (
                      <div className="flex justify-between text-[11px] text-cyan-300">
                        <span>Bienes Excluidos (IVA 0% Canasta Agro):</span>
                        <span className="font-mono font-semibold">${adminFin.totalExempt.toLocaleString()} COP</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm text-cyan-400 pt-1 border-t border-slate-700/60">
                      <span>Total Orden & Domicilio:</span>
                      <span>${adminFin.total.toLocaleString()} COP</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sub-Órdenes Desglosadas por Empresa Aliada */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Paquetes de Envío & Domicilios ({selectedOrder.subOrders?.length || 0})
              </h4>

              <div className="space-y-3">
                {selectedOrder.subOrders?.map((sub) => (
                  <div key={sub.id} className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                    isDark ? 'bg-[#0f1824] border-slate-700/70' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-white">{sub.companyName}</span>
                        <span className="font-mono text-[10px] text-slate-400">({sub.subOrderNumber})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${STATUS_CONFIG[sub.status]?.bg || ''}`}>
                        {STATUS_CONFIG[sub.status]?.label || sub.status}
                      </span>
                    </div>

                    {sub.carrierName && (
                      <p className="text-[11px] text-slate-400">
                        Repartidor / Transportador: <strong className="text-white">{sub.carrierName}</strong> {sub.trackingCode && `• Guía: ${sub.trackingCode}`}
                      </p>
                    )}

                    <div className="divide-y divide-slate-700/40 pt-1">
                      {sub.items?.map((it) => (
                        <div key={it.id} className="py-1.5 flex justify-between items-center text-xs">
                          <span className="text-slate-300">
                            {it.quantity}x {it.productName} <span className="text-slate-400 text-[10px]">({it.sku})</span>
                          </span>
                          <span className="font-bold text-white">
                            ${it.lineTotal?.toLocaleString()} COP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  isDark ? 'bg-[#0f1824] border-slate-700 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cerrar Auditoría
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
