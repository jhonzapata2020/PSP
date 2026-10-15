import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  RefreshCw,
  ExternalLink,
  Edit,
  X,
  Filter,
  Eye,
  ShieldCheck
} from 'lucide-react';
import ordersApi from '../../services/ordersApi';
import { useAuth } from '../../context/AuthContext';

const TERMINAL_STATUSES = ['delivered', 'cancelled'];

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  preparing: { label: 'En Preparación', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  ready_to_ship: { label: 'Listo para Despacho', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  shipped: { label: 'En Camino / Despachado', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  delivered: { label: 'Entregado', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-teal-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelado', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  pending: { label: 'Pendiente', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
};

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const [subOrders, setSubOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal de actualización de estado
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalCarrier, setModalCarrier] = useState('');
  const [modalTracking, setModalTracking] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadVendorOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getVendorOrders({ status: statusFilter, page, pageSize: 15 });
      setSubOrders(res?.items || []);
      setTotal(res?.total || 0);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pedidos de la empresa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendorOrders();
  }, [statusFilter, page]);

  const openStatusModal = (sub) => {
    setSelectedSubOrder(sub);
    setModalStatus(sub.status || 'confirmed');
    setModalCarrier(sub.carrierName || 'PSP Express / Domicilio Local');
    setModalTracking(sub.trackingCode || '');
    setModalNotes(sub.notes || '');
    setModalError('');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedSubOrder) return;

    setModalSaving(true);
    setModalError('');
    try {
      await ordersApi.updateVendorSubOrderStatus(selectedSubOrder.id, {
        status: modalStatus,
        carrierName: modalCarrier.trim() || null,
        trackingCode: modalTracking.trim() || null,
        notes: modalNotes.trim() || null
      });

      setSelectedSubOrder(null);
      await loadVendorOrders();
    } catch (err) {
      setModalError(err.message || 'Error al actualizar estado del pedido.');
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 dark:text-teal-400">
            Portal Comerciante &bull; {user?.companyName || 'Empresa Aliada'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Gestión de Pedidos Recibidos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revisa, alista y despacha los paquetes comprados por los usuarios de Urabá y el país.
          </p>
        </div>

        <button
          onClick={loadVendorOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Pedidos</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filtros de Estado */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: '', label: 'Todos los Pedidos' },
          { id: 'confirmed', label: 'Nuevos / Confirmados' },
          { id: 'preparing', label: 'En Preparación' },
          { id: 'ready_to_ship', label: 'Listos para Despacho' },
          { id: 'shipped', label: 'En Camino / Despachados' },
          { id: 'delivered', label: 'Entregados' },
          { id: 'cancelled', label: 'Cancelados' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setStatusFilter(tab.id); setPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-[#0c4236] text-white dark:bg-teal-400 dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs">
          Cargando pedidos de tu empresa...
        </div>
      ) : subOrders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl space-y-3">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hay pedidos en este estado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Cuando los clientes compren productos de tu catálogo, aparecerán aquí para que coordines el empaque y despacho.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subOrders.map((sub) => {
            const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
            const parentOrder = sub.order;

            return (
              <div 
                key={sub.id}
                className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
              >
                {/* Cabecera de la Sub-Orden */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      Paquete #{sub.subOrderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#0c4236] dark:text-teal-400">
                      ${sub.totalAmount?.toLocaleString()} COP
                    </span>
                    {TERMINAL_STATUSES.includes(sub.status) ? (
                      <button
                        onClick={() => openStatusModal(sub)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Ver Información</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openStatusModal(sub)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Gestionar / Despachar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Datos del Cliente y Destino */}
                {parentOrder && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Cliente</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{parentOrder.buyerName}</p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{parentOrder.buyerPhone}</span>
                      </p>
                    </div>

                    <div className="space-y-0.5 sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Destino de Entrega</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>{parentOrder.shippingAddress}, {parentOrder.shippingMunicipality}</span>
                      </p>
                      {parentOrder.shippingNotes && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                          Nota: "{parentOrder.shippingNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Ítems del paquete que corresponden a esta Empresa */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Productos de este paquete ({sub.items?.length || 0})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sub.items?.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                        <img 
                          src={item.productImage || '/icon.png'} 
                          alt={item.productName} 
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                          <p className="text-[11px] text-slate-400">
                            {item.quantity} un. &bull; SKU: {item.sku} &bull; <strong className="text-slate-700 dark:text-slate-300">${item.lineTotal?.toLocaleString()} COP</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info de despacho */}
                {sub.carrierName && (
                  <div className="text-xs text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Truck className="w-3.5 h-3.5 text-purple-500" />
                    <span>Despachado con: <strong className="text-slate-800 dark:text-slate-200">{sub.carrierName}</strong></span>
                    {sub.trackingCode && <span>&bull; Guía: <strong>{sub.trackingCode}</strong></span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalle o Actualización de Estado */}
      {selectedSubOrder && (() => {
        const isTerminal = TERMINAL_STATUSES.includes(selectedSubOrder.status);
        const isDelivered = selectedSubOrder.status === 'delivered';
        const isCancelled = selectedSubOrder.status === 'cancelled';
        const statusCfg = STATUS_CONFIG[selectedSubOrder.status] || STATUS_CONFIG.pending;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {isDelivered ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
                  ) : isCancelled ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Truck className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
                  )}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {isTerminal ? 'Información del Paquete' : 'Gestionar Paquete'} #{selectedSubOrder.subOrderNumber}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {modalError}
                </div>
              )}

              {/* VISTA SOLO LECTURA PARA ESTADOS TERMINALES (Entregado o Cancelado) */}
              {isTerminal ? (
                <div className="space-y-4">
                  
                  {/* Banner Informativo */}
                  {isDelivered && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-teal-300 text-xs flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Paquete Entregado al Cliente Final</p>
                        <p className="text-[11px] text-emerald-700/90 dark:text-teal-400/90 mt-0.5 leading-relaxed">
                          Este pedido ya fue completado y entregado. Por políticas de trazabilidad y seguridad comercial, la información no admite modificaciones adicionales.
                        </p>
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Paquete Cancelado</p>
                        <p className="text-[11px] text-rose-700/90 dark:text-rose-400/90 mt-0.5 leading-relaxed">
                          Este paquete fue cancelado y las unidades fueron liberadas automáticamente al inventario del catálogo. No admite modificaciones adicionales.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tarjetas de Datos de Envío (Solo Lectura) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Estado Definitivo</span>
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusCfg.bg}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Fecha del Registro</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedSubOrder.deliveredAt 
                          ? new Date(selectedSubOrder.deliveredAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                          : selectedSubOrder.cancelledAt
                          ? new Date(selectedSubOrder.cancelledAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                          : new Date(selectedSubOrder.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                        }
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Empresa Transportadora</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{selectedSubOrder.carrierName || 'No especificada'}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Guía / Contacto Domiciliario</span>
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {selectedSubOrder.trackingCode || 'Sin número de guía'}
                      </p>
                    </div>
                  </div>

                  {selectedSubOrder.notes && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Notas de Despacho Registradas</span>
                      <p className="text-slate-700 dark:text-slate-300 italic">
                        "{selectedSubOrder.notes}"
                      </p>
                    </div>
                  )}

                  {isCancelled && selectedSubOrder.cancellationReason && (
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-500">Motivo de Cancelación</span>
                      <p className="text-rose-700 dark:text-rose-300 font-semibold">
                        {selectedSubOrder.cancellationReason}
                      </p>
                    </div>
                  )}

                  {/* Resumen de Artículos en el Paquete */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Artículos incluidos ({selectedSubOrder.items?.length || 0})
                    </span>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto">
                      {selectedSubOrder.items?.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.productName}</p>
                            <p className="text-[10px] text-slate-400">SKU: {item.sku} &bull; {item.quantity} unidad(es)</p>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white shrink-0">
                            ${item.lineTotal?.toLocaleString()} COP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón único de cierre */}
                  <div className="pt-3 flex justify-end border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedSubOrder(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cerrar Información
                    </button>
                  </div>

                </div>
              ) : (
                /* FORMULARIO EDITABLE PARA ESTADOS ACTIVOS (confirmed, preparing, ready_to_ship, shipped) */
                <form onSubmit={handleSaveStatus} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nuevo Estado del Envío *
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                    >
                      <option value="confirmed">Confirmado (Recibido)</option>
                      <option value="preparing">En Preparación (Empacando)</option>
                      <option value="ready_to_ship">Listo para Despacho</option>
                      <option value="shipped">En Camino / Despachado</option>
                      <option value="delivered">Entregado al Cliente (Definitivo)</option>
                      <option value="cancelled">Cancelar Paquete (Libera Stock)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Empresa Transportadora / Domiciliario
                    </label>
                    <input
                      type="text"
                      value={modalCarrier}
                      onChange={(e) => setModalCarrier(e.target.value)}
                      placeholder="Ej. PSP Express Domicilios / Servientrega"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Número de Guía o Teléfono del Domiciliario
                    </label>
                    <input
                      type="text"
                      value={modalTracking}
                      onChange={(e) => setModalTracking(e.target.value)}
                      placeholder="Ej. GUIA-983471 / Cel 314 555 1234"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Notas de Seguimiento
                    </label>
                    <input
                      type="text"
                      value={modalNotes}
                      onChange={(e) => setModalNotes(e.target.value)}
                      placeholder="Ej. Entregado al domiciliario a las 2:30 PM"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedSubOrder(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={modalSaving}
                      className="px-5 py-2 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {modalSaving ? 'Guardando...' : 'Actualizar Estado'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        );
      })()}

    </div>
  );
}
