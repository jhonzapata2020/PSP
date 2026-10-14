import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Store, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  XCircle, 
  ChevronRight, 
  RefreshCw,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import ordersApi from '../../services/ordersApi';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  preparing: { label: 'En Preparación', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  ready_to_ship: { label: 'Listo para Despacho', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  shipped: { label: 'En Camino / Despachado', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  delivered: { label: 'Entregado', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-teal-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelado', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  pending: { label: 'Pendiente', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
};

export default function MisPedidosPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getMyOrders({ page: 1, pageSize: 20 });
      setOrders(res?.items || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Seguro que deseas cancelar este pedido? Se liberará el inventario reservado.'))
      return;

    setCancellingId(orderId);
    try {
      await ordersApi.cancelMyOrder(orderId);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Error al cancelar pedido.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/comercio"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio Comercial</span>
        </Link>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Mis Compras y Pedidos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Seguimiento de entregas y paquetes organizados por cada Empresa Aliada de Urabá.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm">
          Cargando el historial de tus pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aún no has realizado compras</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explora los productos locales, agrégalos a tu carrito y haz tu primer pedido.
          </p>
          <Link
            to="/comercio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-psp-cyan text-slate-950 font-bold text-xs"
          >
            <span>Ir a la Tienda</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const masterStatusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const canCancel = order.status === 'confirmed' || order.status === 'pending';

            return (
              <div 
                key={order.id}
                className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl p-5 sm:p-7 shadow-sm space-y-5"
              >
                {/* Cabecera de la Orden Maestra */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${masterStatusCfg.bg}`}>
                        {masterStatusCfg.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Fecha: {new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Pagado / Estimado</p>
                      <p className="text-base sm:text-lg font-black text-[#0c4236] dark:text-teal-400">
                        ${order.totalAmount?.toLocaleString()} COP
                      </p>
                    </div>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id ? 'Cancelando...' : 'Cancelar Pedido'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Datos de Entrega */}
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Entrega en: </span>
                    {order.shippingAddress}, {order.shippingMunicipality} &bull; Recibe: <span className="font-semibold">{order.buyerName}</span> ({order.buyerPhone})
                  </div>
                </div>

                {/* Sub-Órdenes por Empresa Aliada (Split-Marketplace) */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Paquetes de Envío ({order.subOrders?.length || 1})
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    {order.subOrders?.map((sub, sIdx) => {
                      const subStatusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                      return (
                        <div 
                          key={sub.id}
                          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182422]/40 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {sub.companyName || 'Comercio Local'}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                {sub.subOrderNumber}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${subStatusCfg.bg}`}>
                              {subStatusCfg.label}
                            </span>
                          </div>

                          {/* Info de Despacho si está en camino */}
                          {sub.carrierName && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 text-purple-500" />
                              <span>Transportador / Domicilio: <strong className="text-slate-800 dark:text-slate-200">{sub.carrierName}</strong></span>
                              {sub.trackingCode && <span>&bull; Guía/Tel: <strong>{sub.trackingCode}</strong></span>}
                            </div>
                          )}

                          {/* Ítems del paquete */}
                          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {sub.items?.map((item) => (
                              <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img 
                                    src={item.productImage || '/icon.png'} 
                                    alt={item.productName} 
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                                    <p className="text-[10px] text-slate-400">SKU: {item.sku} &bull; Cantidad: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                                  ${item.lineTotal?.toLocaleString()} COP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
