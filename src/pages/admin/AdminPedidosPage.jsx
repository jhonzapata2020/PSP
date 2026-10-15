import React, { useState, useEffect } from 'react';
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
  Package
} from 'lucide-react';
import ordersApi from '../../services/ordersApi';
import { calculateOrderFinancialBreakdown, getPaymentDisplayInfo } from '../../utils/orderTaxUtils';

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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-psp-teal dark:text-psp-cyan" />
            <span>Administración Global de Pedidos</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervisión consolidada de ventas, auditoría de pagos Wompi y despacho de Empresas Aliadas.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Pedidos</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Ventas en Vista</p>
            <p className="text-lg font-black text-[#0c4236] dark:text-teal-400">${totalSales.toLocaleString()} COP</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">En Despacho / Tránsito</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">{inProgressCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Entregados con Éxito</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{deliveredCount}</p>
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-psp-dark-card text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-psp-dark-card text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="">Todos los Estados</option>
            <option value="confirmed">Confirmados</option>
            <option value="preparing">En Preparación</option>
            <option value="ready_to_ship">Listo para Despacho</option>
            <option value="shipped">En Camino</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de Pedidos */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-psp-dark-card shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-500" />
            <span>Cargando pedidos de la plataforma...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="font-bold text-xs">No se encontraron pedidos con los criterios actuales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredOrders.map((o) => {
                  const statusCfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                  const isOnline = Boolean(o.paymentTransactionId || o.paidAt);

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{o.buyerName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{o.buyerEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {o.shippingMunicipality || 'Apartadó'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {o.subOrders?.map((sub) => (
                            <span 
                              key={sub.id} 
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-semibold"
                            >
                              {sub.companyName || 'Comercio Local'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                        ${o.totalAmount?.toLocaleString()} COP
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOnline 
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-teal-300' 
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
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
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
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

      {/* MODAL / SLIDE-OVER DE AUDITORÍA DETALLADA */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header del Modal */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_CONFIG[selectedOrder.status]?.bg || ''}`}>
                    {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Creado el: {new Date(selectedOrder.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Datos del Comprador y Destino */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Datos del Comprador</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.buyerName}</p>
                <p className="text-slate-500">{selectedOrder.buyerEmail}</p>
                <p className="text-slate-500">Tel: {selectedOrder.buyerPhone}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destino de Entrega</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.shippingAddress}</p>
                {selectedOrder.shippingNeighborhood && <p className="text-slate-500">Barrio: {selectedOrder.shippingNeighborhood}</p>}
                <p className="text-slate-500">{selectedOrder.shippingMunicipality}, Antioquia</p>
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
                      ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50' 
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {adminPay.isOnline ? (
                          <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{adminPay.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        adminPay.isOnline 
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-teal-300' 
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}>
                        {adminPay.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-300">
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
                        <div className="flex items-center gap-1 font-mono text-[10px] text-teal-700 dark:text-teal-300 truncate">
                          <span>{adminPay.transactionId || 'N/A'}</span>
                          {adminPay.transactionId && (
                            <button onClick={() => copyToClipboard(adminPay.transactionId)} className="p-0.5 hover:text-teal-500 cursor-pointer">
                              {copiedTxId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Autorización Bancaria:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{adminPay.authorizationCode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desglose Financiero y Tributario DIAN */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal Artículos:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">${adminFin.subtotal.toLocaleString()} COP</span>
                    </div>
                    {adminFin.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-teal-400 font-bold">
                        <span>Descuento Aplicado:</span>
                        <span>-${adminFin.discount.toLocaleString()} COP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                      <span>Base Gravable (19%):</span>
                      <span className="font-mono">${adminFin.baseGravable19.toLocaleString()} COP</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>IVA 19% Discriminado:</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">${adminFin.iva19.toLocaleString()} COP</span>
                    </div>
                    {adminFin.totalExempt > 0 && (
                      <div className="flex justify-between text-[11px] text-emerald-700 dark:text-teal-300">
                        <span>Bienes Excluidos (IVA 0% Canasta Agro):</span>
                        <span className="font-mono font-semibold">${adminFin.totalExempt.toLocaleString()} COP</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm text-[#0c4236] dark:text-teal-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span>Total Orden:</span>
                      <span>${adminFin.total.toLocaleString()} COP</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sub-Órdenes Desglosadas por Empresa Aliada */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Paquetes de Envío ({selectedOrder.subOrders?.length || 0})
              </h4>

              <div className="space-y-3">
                {selectedOrder.subOrders?.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-teal-400" />
                        <span className="font-bold text-slate-900 dark:text-white">{sub.companyName}</span>
                        <span className="font-mono text-[10px] text-slate-400">({sub.subOrderNumber})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${STATUS_CONFIG[sub.status]?.bg || ''}`}>
                        {STATUS_CONFIG[sub.status]?.label || sub.status}
                      </span>
                    </div>

                    {sub.carrierName && (
                      <p className="text-[11px] text-slate-500">
                        Transportador: <strong>{sub.carrierName}</strong> {sub.trackingCode && `• Guía: ${sub.trackingCode}`}
                      </p>
                    )}

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50 pt-1">
                      {sub.items?.map((it) => (
                        <div key={it.id} className="py-1.5 flex justify-between items-center text-xs">
                          <span className="text-slate-700 dark:text-slate-300">
                            {it.quantity}x {it.productName} <span className="text-slate-400 text-[10px]">({it.sku})</span>
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
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
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
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
